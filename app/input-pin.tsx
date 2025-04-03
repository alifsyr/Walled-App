import React, { useState, useCallback } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ConfirmPin() {
  const router = useRouter();
  const {
    trxId = "",
    type = "",
    beneficiary = "",
    sourceOfFund,
    amount = "",
    notes = "-",
    time = "",
  } = useLocalSearchParams();

  const [pin, setPin] = useState("");

  const handleChange = useCallback((text: string) => {
    const digits = text.replace(/\D/g, "");
    if (digits.length <= 6) setPin(digits);
  }, []);

  const handleConfirm = useCallback(() => {
    if (pin.length !== 6) {
      Alert.alert("Invalid PIN", "Please enter a 6-digit PIN.");
      return;
    }

    console.log("PIN entered:", pin);

    // Optional: verify PIN with backend here before continuing

    router.replace({
      pathname: "/transaction-status",
      params: {
        status: "success",
        type,
        trxId,
        beneficiary,
        sourceOfFund,
        amount,
        notes,
        time,
      },
    });
  }, [
    pin,
    type,
    trxId,
    beneficiary,
    sourceOfFund,
    amount,
    notes,
    time,
    router,
  ]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-white items-center justify-center px-6"
      >
        <View className="w-full max-w-md">
          <Text className="text-2xl font-bold text-center mb-2">
            Confirm Transaction
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            Enter your 6-digit PIN to confirm this transaction
          </Text>

          {amount && (
            <Text className="text-center text-lg font-semibold mb-4">
              Amount:{" "}
              <Text className="text-blue-500">
                Rp {Number(amount).toLocaleString("id-ID")}
              </Text>
            </Text>
          )}

          <TextInput
            value={pin}
            onChangeText={handleChange}
            placeholder="Enter PIN"
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            className="text-center text-3xl font-bold tracking-widest border border-gray-300 rounded-xl px-4 py-3 mb-6 text-black"
          />

          <TouchableOpacity
            onPress={handleConfirm}
            disabled={pin.length !== 6}
            className={`rounded-xl p-4 items-center ${
              pin.length === 6 ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <Text className="text-white font-semibold text-lg">Confirm</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
