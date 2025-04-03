import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function TransactionStatus() {
  const { status, source, type, amount, notes, time, beneficiary } =
    useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  const isSuccess = status === "success";
  const animationSource = isSuccess
    ? require("@/assets/animations/success.json")
    : require("@/assets/animations/fail.json");

  const message = isSuccess ? "Transaction Successful" : "Transaction Failed";
  const textColorClass = isSuccess ? "text-[#0061FF]" : "text-red-500";

  return (
    <View className="flex-1 bg-[#FAFBFD] items-center justify-center px-6">
      <LottieView
        source={animationSource}
        autoPlay
        loop
        style={{ width: 240, height: 240 }}
      />

      <Text className={`text-xl font-bold mt-6 text-center ${textColorClass}`}>
        {message}
      </Text>

      <View className="bg-white rounded-2xl p-4 mt-6 w-full">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500 font-medium">Source of Fund</Text>
          <Text className="text-gray-900 font-semibold">{source}</Text>
        </View>

        {type === "Transfer" && (
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500 font-medium">Beneficiary</Text>
            <Text className="text-gray-900 font-semibold">{beneficiary}</Text>
          </View>
        )}

        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500 font-medium">Type</Text>
          <Text className="text-gray-900 font-semibold">{type}</Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500 font-medium">Amount</Text>
          <Text className="text-gray-900 font-semibold">{amount}</Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500 font-medium">Notes</Text>
          <Text className="text-gray-900 font-semibold">{notes || "-"}</Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-gray-500 font-medium">Time</Text>
          <Text className="text-gray-900 font-semibold">{time}</Text>
        </View>
      </View>

      <View className="absolute bottom-10 left-4 right-4 items-center">
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          className="rounded-xl w-full max-w-md p-4 items-center bg-blue-500"
        >
          <Text className="text-white font-bold text-lg">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
