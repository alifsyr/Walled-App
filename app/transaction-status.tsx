import React, { useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const renderDetailRow = (label: string, value: string | number | undefined) => (
  <View className="flex-row justify-between mb-2">
    <Text className="text-gray-500 font-medium">{label}</Text>
    <Text className="text-gray-900 font-semibold">{value || "-"}</Text>
  </View>
);

export default function TransactionStatus() {
  const { status, source, type, amount, notes, time, beneficiary, trxId } =
    useLocalSearchParams();
  const router = useRouter();

  const isSuccess = status === "success";

  const animationSource = useMemo(
    () =>
      isSuccess
        ? require("@/assets/animations/success.json")
        : require("@/assets/animations/fail.json"),
    [isSuccess],
  );

  const message = isSuccess ? "Transaction Successful" : "Transaction Failed";
  const textColorClass = isSuccess ? "text-[#0061FF]" : "text-red-500";

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

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
        {renderDetailRow("Transaction ID", String(trxId))}
        {type === "Top Up" && renderDetailRow("Source of Fund", String(source))}
        {type === "Transfer" &&
          renderDetailRow("Beneficiary", String(beneficiary))}
        {renderDetailRow("Type", String(type))}
        {renderDetailRow("Amount", String(amount))}
        {renderDetailRow("Notes", String(notes))}
        {renderDetailRow("Time", String(time))}
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
