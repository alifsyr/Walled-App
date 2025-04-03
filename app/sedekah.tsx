import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { router } from "expo-router";

import { formatCurrency, generateTransactionId } from "@/script/utils";

const DONATION_AMOUNTS = [
  1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000,
];
const DEFAULT_SOURCE = "walled";

export default function Sedekah() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [accountBalance, setAccountBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const mockBalance = 8000000;
      setAccountBalance(mockBalance);
    };
    fetchBalance();
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedAmount) return;

    const trxId = generateTransactionId("Sedekah");
    const timestamp = new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    router.push({
      pathname: "/input-pin",
      params: {
        trxId,
        type: "Sedekah",
        amount: selectedAmount,
        source: DEFAULT_SOURCE,
        time: timestamp,
      },
    });
  }, [selectedAmount]);

  const renderDonationButton = useCallback(
    (amount: number) => {
      const isSelected = selectedAmount === amount;
      return (
        <TouchableOpacity
          key={amount}
          onPress={() => setSelectedAmount(amount)}
          className={`w-[48%] py-3 rounded-xl items-center ${
            isSelected ? "bg-[#0061FF]" : "bg-gray-200"
          }`}
        >
          <Text
            className={`font-bold ${isSelected ? "text-white" : "text-black"}`}
          >
            Rp {formatCurrency(amount)}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedAmount],
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-[#FAFBFD] p-6 items-center justify-center">
        <Text className="text-xl font-bold text-center mb-4">
          Share your blessings today! ❤️
        </Text>

        <View className="w-full max-w-md bg-white rounded-2xl p-4 mb-6">
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {DONATION_AMOUNTS.map(renderDonationButton)}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          disabled={!selectedAmount}
          className={`rounded-xl w-full max-w-md p-4 items-center ${
            !selectedAmount ? "bg-gray-400" : "bg-[#0061FF]"
          }`}
        >
          <Text className="text-white font-bold text-lg">Confirm</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
