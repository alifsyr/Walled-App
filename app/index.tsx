import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Image, StyleSheet, Text } from "react-native";
import { getAccessToken } from "@/script/utils";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const token = await getAccessToken();
      setTimeout(() => {
        if (token) {
          router.replace("/home");
        } else {
          router.replace("/login");
        }
      }, 3000); // Delay 3 detik
    };

    checkSession();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image
        source={require("@/assets/images/logo.png")}
        className="w-24 h-24 mb-4"
        resizeMode="contain"
      />
      <Text style={styles.title}>Walled</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 48,
    fontWeight: "bold",
  },
});
