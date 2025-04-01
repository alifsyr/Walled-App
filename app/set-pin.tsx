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
} from "react-native";
import { router } from "expo-router";

export default function SetPin() {
  const [pin, setPin] = useState("");

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, ""); // remove non-numeric
    if (digits.length <= 6) {
      setPin(digits);
    }
  };

  const handleSubmit = () => {
    if (pin.length < 6) {
      Alert.alert("PIN must be 6 digits");
      return;
    }
    console.log("PIN set:", pin);

    // Save the PIN to backend or secure store here

    Alert.alert("PIN Created", "Your PIN has been set successfully.", [
      {
        text: "Continue",
        onPress: () => router.replace("/home"), // redirect to home
      },
    ]);
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
            disabled={pin.length !== 6}
            className={`rounded-xl p-4 items-center ${
              pin.length === 6 ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <Text className="text-white font-semibold text-lg">Save PIN</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
