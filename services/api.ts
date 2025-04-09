// services/api.tsx

import axios, {
  AxiosError,
  AxiosResponse,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
  clearAllTokens,
} from "@/script/utils";

/**
 * Bentuk response sukses dari endpoint refresh token:
 * {
 *   "responseCode": 200,
 *   "message": "Token refreshed successfully",
 *   "data": {
 *     "accessToken": string,
 *     "refreshToken": string
 *   }
 * }
 */
interface RefreshResponse {
  responseCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * Tipe untuk item request yang gagal (401/403) dan
 * menunggu refresh token selesai.
 */
type FailedRequest = {
  resolve: (token: string) => void;
  reject: (reason?: unknown) => void;
};

// Membuat instance axios
const api = axios.create({
  baseURL: "http://localhost:8080", // Sesuaikan sesuai API Anda
  timeout: 30000,
});

// Menandakan apakah proses refresh sedang berlangsung
let isRefreshing = false;

// Antrian request yang gagal karena token invalid, menunggu refresh
let failedQueue: FailedRequest[] = [];

/**
 * Memproses semua request yang tertunda dalam `failedQueue`.
 * @param error - error saat refresh (jika ada)
 * @param token - token baru (jika refresh sukses)
 */
const processQueue = (error: unknown, token: string | null) => {
  console.log("[processQueue] error?", !!error, "newToken?", token);

  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      // Ketika berhasil, kita kirim token baru ke resolve
      resolve(token!);
    }
  });

  failedQueue = [];
};

/**
 * Memanggil endpoint refresh token:
 * Contoh: POST /auth/refresh?refreshToken=<refresh_token>
 */
async function refreshAccessToken(): Promise<string> {
  console.log("[refreshAccessToken] Starting...");

  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    console.log("[refreshAccessToken] No refresh token found.");
    throw new Error("No refresh token found");
  }

  // Contoh URL: http://localhost:8080/auth/refresh?refreshToken=xxx
  const url = `http://localhost:8080/auth/refresh?refreshToken=${refreshToken}`;
  console.log("[refreshAccessToken] Calling:", url);

  // Panggil endpoint refresh
  const response = await axios.post<RefreshResponse>(url);
  const { data } = response;

  // Pastikan responseCode == 200
  if (data.responseCode !== 200) {
    console.log("[refreshAccessToken] responseCode != 200 -> error");
    throw new Error(`Refresh token error: ${data.message}`);
  }

  // Simpan token baru ke storage
  const { accessToken, refreshToken: newRefresh } = data.data;
  console.log("[refreshAccessToken] New tokens:", { accessToken, newRefresh });

  await saveAccessToken(accessToken);
  await saveRefreshToken(newRefresh);

  return accessToken;
}

/**
 * Interceptor: Request
 * - Menyisipkan header Authorization: Bearer <token> secara otomatis.
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const shouldSkipAuth =
      config.headers?.skipAuth === "true" || config.headers?.skipAuth === true;

    if (shouldSkipAuth) {
      // Hapus skipAuth agar tidak ikut terkirim ke server
      if (config.headers instanceof AxiosHeaders) {
        config.headers.delete("skipAuth");
      } else {
        delete (config.headers as any).skipAuth;
      }
      console.log("[Request Interceptor] Skipping token for this request.");
      return config;
    }

    const token = await getAccessToken();
    if (token) {
      if (!config.headers || !(config.headers instanceof AxiosHeaders)) {
        config.headers = new AxiosHeaders(config.headers);
      }
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Interceptor: Response
 * - Jika response 401/403 -> refresh token otomatis
 * - Setelah refresh sukses, ulangi request
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Jika sukses (status 2xx), kembalikan apa adanya
    return response;
  },
  async (error: AxiosError) => {
    console.log("[Response Interceptor] Error:", error.message);

    // originalRequest - data request yang menyebabkan error
    const originalRequest = error.config as
      | InternalAxiosRequestConfig
      | undefined;

    // Jika server tidak merespon atau originalRequest hilang, tolak langsung
    if (!error.response || !originalRequest) {
      console.log("[Response Interceptor] No response or request config.");
      return Promise.reject(error);
    }

    const statusCode = error.response.status;

    // Tangani hanya 401/403
    if (statusCode !== 401 && statusCode !== 403) {
      console.log(`[Response Interceptor] status ${statusCode}, ignoring.`);
      return Promise.reject(error);
    }

    // Cegah infinite loop - jika sudah di-retry, tolak
    if ((originalRequest as any)._retry) {
      console.log("[Response Interceptor] Already retried, rejecting.");
      return Promise.reject(error);
    }
    (originalRequest as any)._retry = true;

    // Jika refresh sedang berlangsung, masukkan request ini ke `failedQueue`
    if (isRefreshing) {
      console.log(
        "[Response Interceptor] Refresh in progress, queueing request.",
      );
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          console.log(
            "[Response Interceptor] Received token from queue:",
            token,
          );

          // pastikan originalRequest.headers adalah AxiosHeaders
          if (
            !originalRequest.headers ||
            !(originalRequest.headers instanceof AxiosHeaders)
          ) {
            originalRequest.headers = new AxiosHeaders(originalRequest.headers);
          }
          // Set header Authorization
          originalRequest.headers.set("Authorization", `Bearer ${token}`);

          // Ulangi request
          return axios.request(originalRequest);
        })
        .catch((err) => {
          console.log("[Response Interceptor] Queue request failed:", err);
          return Promise.reject(err);
        });
    }

    // Jika belum ada proses refresh, mulai sekarang
    isRefreshing = true;
    console.log("[Response Interceptor] Initiating refresh...");

    return new Promise(async (resolve, reject) => {
      try {
        const newToken = await refreshAccessToken();
        console.log(
          "[Response Interceptor] Refresh success. New token:",
          newToken,
        );

        // Beri tahu semua request di antrian
        processQueue(null, newToken);

        // Siapkan headers -> pakai AxiosHeaders
        if (
          !originalRequest.headers ||
          !(originalRequest.headers instanceof AxiosHeaders)
        ) {
          originalRequest.headers = new AxiosHeaders(originalRequest.headers);
        }
        originalRequest.headers.set("Authorization", `Bearer ${newToken}`);

        // Ulangi request
        const newResponse = await axios.request(originalRequest);
        resolve(newResponse);
      } catch (err) {
        // Refresh gagal -> hapus token, user harus login ulang
        console.log(
          "[Response Interceptor] Refresh failed, clearing tokens...",
        );
        processQueue(err, null);
        await clearAllTokens();
        reject(err);
      } finally {
        isRefreshing = false;
      }
    });
  },
);

export default api;
