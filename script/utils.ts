// utils.tsx
import * as SecureStore from "expo-secure-store";

// --- Constants ---
const CURRENCY_LOCALE = "id-ID";

// Anda bisa menentukan konstanta KEY yang spesifik untuk akses & refresh token
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * Generates a unique transaction ID
 * @param type Transaction type, e.g., "Top Up"
 * @returns A string representing a unique transaction ID
 */
export function generateTransactionId(type: string = "TX"): string {
  const prefix = "TX";

  const typeCodeMap: Record<string, number> = {
    TOPUP: 1,
    TRANSFER: 2,
    SEDEKAH: 3,
  };

  const normalizedType = type.replace(/\s+/g, "").toUpperCase();
  const transactionCode = typeCodeMap[normalizedType] || 0;

  // Timestamp dalam base 36 agar lebih ringkas
  const timestamp = Date.now().toString(36).toUpperCase();
  // Random 4 karakter di belakang
  const randomSuffix = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `${prefix}-${transactionCode}-${timestamp}-${randomSuffix}`;
}

/**
 * Formats a number into IDR currency style
 * @param value number to format
 * @returns formatted currency string, e.g. "1.234"
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString(CURRENCY_LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Formats a number into a shortened IDR currency format
 * @param value number to format
 * @returns shortened currency string, e.g. "Rp 1.2Jt"
 */
export function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000_000)
    return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}Jt`;
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}Ribu`;
  return `Rp ${value}`;
}

// === SecureStore Helpers ===

/**
 * Save an arbitrary value to SecureStore
 * @param key Storage key
 * @param value Value to save
 */
export async function saveToken(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

/**
 * Retrieve a value from SecureStore
 * @param key Storage key
 * @returns Stored value or null
 */
export async function getToken(key: string): Promise<string | null> {
  return await SecureStore.getItemAsync(key);
}

/**
 * Delete a value from SecureStore
 * @param key Storage key
 */
export async function deleteToken(key: string) {
  await SecureStore.deleteItemAsync(key);
}

/**
 * Clear all tokens (access & refresh)
 */
export async function clearAllTokens() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

/**
 * Helper for saving access token
 * @param accessToken string
 */
export async function saveAccessToken(accessToken: string) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
}

/**
 * Helper for retrieving access token
 * @returns string or null
 */
export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

/**
 * Helper for saving refresh token
 * @param refreshToken string
 */
export async function saveRefreshToken(refreshToken: string) {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * Helper for retrieving refresh token
 * @returns string or null
 */
export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

/**
 * Delete only access token
 */
export async function deleteAccessToken() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}

/**
 * Delete only refresh token
 */
export async function deleteRefreshToken() {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}
