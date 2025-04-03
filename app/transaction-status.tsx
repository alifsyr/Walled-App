import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const renderDetailRow = (label: string, value?: string | number) => (
  <View key={label} className="flex-row justify-between mb-2">
    <Text className="text-gray-500 font-medium">{label}</Text>
    <Text className="text-gray-900 font-semibold">{value || "-"}</Text>
  </View>
);

export default function TransactionStatus() {
  const router = useRouter();
  const hasUserInteracted = useRef(false);

  const {
    status,
    sourceOfFund,
    type,
    amount,
    notes,
    time,
    beneficiary,
    trxId,
  } = useLocalSearchParams<{
    status?: string;
    sourceOfFund?: string;
    type?: string;
    amount?: string;
    notes?: string;
    time?: string;
    beneficiary?: string;
    trxId?: string;
  }>();

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

  const handleNavigate = (path: "/home" | "/sedekah") => {
    hasUserInteracted.current = true;
    router.replace({ pathname: path });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasUserInteracted.current) {
        router.replace({ pathname: "/home" });
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  const details = useMemo(() => {
    const rows = [
      { label: "Transaction ID", value: trxId },
      { label: "Type", value: type },
      { label: "Amount", value: amount },
    ];

    if (type !== "Sedekah") {
      rows.push({ label: "Notes", value: notes });
    }

    rows.push({ label: "Time", value: time });

    if (type === "Top Up") {
      rows.splice(1, 0, { label: "Source of Fund", value: sourceOfFund });
    }

    if (type === "Transfer") {
      rows.splice(1, 0, { label: "Beneficiary", value: beneficiary });
    }

    return rows;
  }, [trxId, type, sourceOfFund, beneficiary, amount, notes, time]);

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
        {details.map(({ label, value }) => renderDetailRow(label, value))}
      </View>

      <View className="absolute bottom-10 left-4 right-4 items-center gap-3">
        <TouchableOpacity
          onPress={() => handleNavigate("/home")}
          className="rounded-xl w-full max-w-md p-4 items-center bg-blue-500"
        >
          <Text className="text-white font-bold text-lg">Back to Home</Text>
        </TouchableOpacity>

        {type !== "Sedekah" && (
          <TouchableOpacity
            onPress={() => handleNavigate("/sedekah")}
            className="rounded-xl w-full max-w-md p-4 items-center bg-green-500"
          >
            <Text className="text-white font-bold text-lg">Go to Sedekah</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
