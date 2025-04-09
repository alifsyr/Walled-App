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
import api from "@/services/api"; // pastikan path sesuai struktur Anda

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
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((text: string) => {
    const digits = text.replace(/\D/g, "");
    if (digits.length <= 6) setPin(digits);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (pin.length !== 6) {
      Alert.alert("Invalid PIN", "Please enter a 6-digit PIN.");
      return;
    }

    try {
      setLoading(true);

      // Kirim PIN ke backend untuk verifikasi
      const response = await api.post("/api/users/verify-pin", {
        pin,
      });

      const result = response.data;

      if (result.responseCode === 200 && result.data === true) {
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
      } else {
        Alert.alert("Verification Failed", "PIN is incorrect.");
      }
    } catch (error) {
      console.error("PIN verification error:", error);
      Alert.alert("Error", "Failed to verify PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    pin,
    router,
    type,
    trxId,
    beneficiary,
    sourceOfFund,
    amount,
    notes,
    time,
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
            placeholderTextColor={"#9CA3AF"}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            className="text-center text-3xl font-bold tracking-widest border border-gray-300 rounded-xl px-4 py-3 mb-6 text-black"
          />

          <TouchableOpacity
            onPress={handleConfirm}
            disabled={pin.length !== 6 || loading}
            className={`rounded-xl p-4 items-center ${
              pin.length === 6 ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              {loading ? "Verifying..." : "Confirm"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
