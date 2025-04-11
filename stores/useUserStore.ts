import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

interface UserState {
  name: string;
  profileImage: any;
  accountType: string;
  setUser: (user: {
    name: string;
    profileImage: any;
    accountType: string;
  }) => void;
  clearUser: () => void;
}

// ✅ Storage adapter compatible with Zustand
const zustandStorage = {
  getItem: async (key: string): Promise<StorageValue<UserState> | null> => {
    const storedValue = await SecureStore.getItemAsync(key);
    return storedValue ? JSON.parse(storedValue) : null;
  },
  setItem: async (key: string, value: StorageValue<UserState>) => {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: "",
      profileImage: null,
      accountType: "",
      setUser: (user) =>
        set({
          name: user.name,
          profileImage: user.profileImage,
          accountType: user.accountType,
        }),
      clearUser: () =>
        set({
          name: "",
          profileImage: null,
          accountType: "",
        }),
    }),
    {
      name: "user-storage",
      storage: zustandStorage,
    },
  ),
);
