import React from "react";
import { router, Stack } from "expo-router";
import { Image, View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Provider as PaperProvider } from "react-native-paper";

import { clearAllTokens } from "@/script/utils";
import { useUserStore } from "@/stores/useUserStore";

import "../global.css";

export default function RootLayout() {
  const name = useUserStore((state) => state.name);
  const profileImage = useUserStore((state) => state.profileImage);
  console.log("profileImage", profileImage);
  const accountType = useUserStore((state) => state.accountType);
  const clearUser = useUserStore((state) => state.clearUser);

  const isLoggedIn = !!name;

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await clearAllTokens();
          clearUser(); // <-- Hapus user dari Zustand
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
        <Stack.Screen
          name="set-pin"
          options={{
            gestureEnabled: false,
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="home"
          options={{
            gestureEnabled: false,
            headerShown: true,
            headerTitle: "",
            headerLeft: () =>
              isLoggedIn ? (
                <View className="flex-row items-center">
                  <Image
                    source={
                      profileImage ??
                      require("@/assets/images/profile-pict.jpg")
                    }
                    className="w-11 h-11 rounded-full border-2 border-[#3b82f6]"
                  />
                  <View className="ml-3">
                    <Text className="font-bold text-base">{name}</Text>
                    <Text className="text-gray-500 text-sm">{accountType}</Text>
                  </View>
                </View>
              ) : null,
            headerRight: () =>
              isLoggedIn ? (
                <TouchableOpacity onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={24} color="black" />
                </TouchableOpacity>
              ) : null,
          }}
        />

        <Stack.Screen
          name="transfer"
          options={{
            gestureEnabled: false,
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
            gestureEnabled: false,
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
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="input-pin" options={{ headerShown: false }} />
        <Stack.Screen
          name="sedekah"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="login"
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack>
    </PaperProvider>
  );
}
