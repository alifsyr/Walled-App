// app/_layout.tsx (atau RootLayout.tsx)
import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import { Image, View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Provider as PaperProvider } from "react-native-paper";

import api from "@/services/api";
import { clearAllTokens } from "@/script/utils";

import "../global.css";

export default function RootLayout() {
  const [user, setUser] = useState<null | {
    name: string;
    profileImage: any;
    accountType: string;
  }>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/users/me");
        const data = res.data.data;

        const profileImage =
          data.user.avatarUrl && data.user.avatarUrl.trim() !== ""
            ? { uri: data.user.avatarUrl }
            : require("@/assets/images/profile-pict.jpg");

        const accountType =
          data.wallet.type === "PERSONAL"
            ? "Personal Account"
            : "Business Account";

        setUser({
          name: data.user.fullName,
          profileImage,
          accountType,
        });
      } catch (err: any) {
        console.log("Error fetching user:", err);
        // Do not redirect here!
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await clearAllTokens();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          animation: "simple_push",
          animationDuration: 200,
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="set-pin" />

        <Stack.Screen
          name="home"
          options={{
            headerShown: true,
            headerTitle: "",
            headerLeft: () =>
              user ? (
                <View className="flex-row items-center">
                  <Image
                    source={user.profileImage}
                    className="w-11 h-11 rounded-full border-2 border-[#178F8D]"
                  />
                  <View className="ml-3">
                    <Text className="font-bold text-base">{user.name}</Text>
                    <Text className="text-gray-500 text-sm">
                      {user.accountType}
                    </Text>
                  </View>
                </View>
              ) : null,
            headerRight: () =>
              user ? (
                <TouchableOpacity onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={24} color="black" />
                </TouchableOpacity>
              ) : null,
          }}
        />

        <Stack.Screen
          name="transfer"
          options={{
            headerShown: true,
            headerTitle: "",
            headerLeft: () => (
              <View className="flex-row items-center">
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold ml-2">Transfer</Text>
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="topup"
          options={{
            headerShown: true,
            headerTitle: "",
            headerLeft: () => (
              <View className="flex-row items-center">
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold ml-2">Top Up</Text>
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="transaction-status"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="input-pin" options={{ headerShown: false }} />
        <Stack.Screen name="sedekah" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
