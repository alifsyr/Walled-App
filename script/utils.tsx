// utils.tsx
import * as SecureStore from "expo-secure-store";

// Constants
const CURRENCY_LOCALE = "id-ID";

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

  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `${prefix}-${transactionCode}-${timestamp}-${randomSuffix}`;
}

/**
 * Formats a number into IDR currency style
 * @param value number to format
 * @returns formatted currency string
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
 * @returns formatted shortened currency string
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
 * Save a value to SecureStore
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
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
}
