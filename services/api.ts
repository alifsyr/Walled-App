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

interface RefreshResponse {
  responseCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (reason?: unknown) => void;
};

const api = axios.create({
  baseURL: "https://walled-api-latest.onrender.com",
  timeout: 30000,
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token found");

  const url = `https://walled-api-latest.onrender.com/auth/refresh?refreshToken=${refreshToken}`;
  const response = await axios.post<RefreshResponse>(url);
  const { data } = response;

  if (data.responseCode !== 200) {
    throw new Error(`Refresh token error: ${data.message}`);
  }

  const { accessToken, refreshToken: newRefresh } = data.data;
  await saveAccessToken(accessToken);
  await saveRefreshToken(newRefresh);
  return accessToken;
}

// ✅ REQUEST INTERCEPTOR: Tambah log lengkap
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const shouldSkipAuth =
      config.headers?.skipAuth === "true" || config.headers?.skipAuth === true;

    // ✅ Logging semua informasi request
    console.log("📤 [REQUEST]", {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      params: config.params,
      data: config.data,
      headers: config.headers,
    });

    if (shouldSkipAuth) {
      if (config.headers instanceof AxiosHeaders) {
        config.headers.delete("skipAuth");
      } else {
        delete (config.headers as any).skipAuth;
      }
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
  (error) => {
    console.log("❌ [REQUEST ERROR]", error);
    return Promise.reject(error);
  },
);

// ✅ RESPONSE INTERCEPTOR: Log respons dan error
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ [RESPONSE]", {
      url: response.config?.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | InternalAxiosRequestConfig
      | undefined;

    if (!error.response || !originalRequest) {
      console.log("❌ [NETWORK ERROR]", error.message);
      return Promise.reject(error);
    }

    const statusCode = error.response.status;

    console.log("❌ [ERROR RESPONSE]", {
      url: originalRequest.url,
      status: statusCode,
      data: error.response.data,
    });

    // 👉 Untuk error selain 403, tampilkan alert
    if ([400, 401, 404].includes(statusCode)) {
      return Promise.resolve(error.response);
    }

    if (statusCode !== 403) {
      return Promise.reject(error);
    }

    // Sudah pernah dicoba refresh
    if ((originalRequest as any)._retry) {
      return Promise.reject(error);
    }
    (originalRequest as any)._retry = true;

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (
            !originalRequest.headers ||
            !(originalRequest.headers instanceof AxiosHeaders)
          ) {
            originalRequest.headers = new AxiosHeaders(originalRequest.headers);
          }
          originalRequest.headers.set("Authorization", `Bearer ${token}`);
          return axios.request(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    return new Promise(async (resolve, reject) => {
      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        if (
          !originalRequest.headers ||
          !(originalRequest.headers instanceof AxiosHeaders)
        ) {
          originalRequest.headers = new AxiosHeaders(originalRequest.headers);
        }
        originalRequest.headers.set("Authorization", `Bearer ${newToken}`);

        const newResponse = await axios.request(originalRequest);
        resolve(newResponse);
      } catch (err) {
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
