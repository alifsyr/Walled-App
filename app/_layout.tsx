import React from "react";
import { Stack, router } from "expo-router";
import { Image, View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Provider as PaperProvider } from "react-native-paper"; // ✅ Add this

import "../global.css";

export default function RootLayout() {
  const user = {
    name: "John Doe",
    balance: 10000000,
    accountNumber: "1234567890",
    profileImage: require("@/assets/images/profile-pict.jpg"),
    accountType: "Personal Account",
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/"),
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
            headerLeft: () => (
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
            ),
            headerRight: () => (
              <TouchableOpacity onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="black" />
              </TouchableOpacity>
            ),
          }}
        />

        <Stack.Screen
          name="transfer"
          options={{
            headerShown: true,
            headerTitle: "",
            animation: "simple_push",
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
            animation: "simple_push",
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
      </Stack>
    </PaperProvider>
  );
}
