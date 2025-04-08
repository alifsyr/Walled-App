import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function SetPin() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (text: string) => {
    const onlyDigits = text.replace(/\D/g, "");
    if (onlyDigits.length <= 6) {
      setPin(onlyDigits);
    }
  };

  const handleSubmit = async () => {
    if (pin.length !== 6) {
      Alert.alert("PIN must be exactly 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");

      if (!accessToken) {
        setLoading(false);
        Alert.alert(
          "Unauthorized",
          "Access token missing. Please log in again.",
        );
        return;
      }

      // Step 1: Set the PIN
      const pinRes = await fetch("http://localhost:8080/auth/set-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ pin }),
      });

      const pinData = await pinRes.json();

      if (pinRes.status === 200) {
        // Step 2: Try to create a wallet
        const walletRes = await fetch("http://localhost:8080/api/wallets", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const walletData = await walletRes.json();

        switch (walletRes.status) {
          case 201:
            Alert.alert("Success", "PIN set and wallet created successfully.", [
              { text: "Continue", onPress: () => router.replace("/home") },
            ]);
            break;
          case 400:
            Alert.alert(
              "Note",
              walletData.message || "User already has a wallet.",
              [{ text: "Continue", onPress: () => router.replace("/home") }],
            );
            break;
          case 403:
            Alert.alert(
              "Session Expired",
              "Your session is invalid or expired.",
            );
            router.replace("/");
            break;
          default:
            Alert.alert(
              "Wallet Error",
              walletData.message || "Something went wrong.",
            );
        }
      } else if (pinRes.status === 400) {
        Alert.alert(
          "PIN Error",
          pinData.message || "PIN has already been set.",
        );
      } else if (pinRes.status === 403) {
        Alert.alert("Session Expired", "Your session is invalid or expired.");
        router.replace("/");
      } else {
        Alert.alert("PIN Error", pinData.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting PIN:", error);
      Alert.alert(
        "Network Error",
        "Unable to complete the request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-white items-center justify-center px-6"
      >
        <View className="w-full max-w-md">
          <Text className="text-2xl font-bold text-center mb-2">
            Create Your PIN
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            This PIN will be used to access your account securely
          </Text>

          <TextInput
            value={pin}
            onChangeText={handleChange}
            placeholder="Enter 6-digit PIN"
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            className="text-center text-3xl font-bold tracking-widest border border-gray-300 rounded-xl px-4 py-3 mb-6 text-black"
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={pin.length !== 6 || loading}
            className={`rounded-xl p-4 items-center ${
              pin.length === 6 ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-lg">Save PIN</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
