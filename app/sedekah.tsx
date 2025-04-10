import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { router } from "expo-router";
import api from "@/services/api";
import { formatCurrency, generateTransactionId } from "@/script/utils";

const DONATION_AMOUNTS = [
  1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000,
];
const DEFAULT_SOURCE = "walled";

export default function Sedekah() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [balance, setBalance] = useState<number>(0);

  // Fetch user balance on mount
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get("/api/wallets/balance");
        if (res.data?.responseCode === 200) {
          setBalance(res.data.data.balance);
        }
      } catch (err) {
        console.warn("Failed to fetch balance", err);
      }
    };

    fetchBalance();
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedAmount) return;

    if (selectedAmount > balance) {
      Alert.alert(
        "Insufficient Balance",
        "Donation amount exceeds your available balance.",
      );
      return;
    }

    const trxId = generateTransactionId("Transfer");
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
        type: "Transfer",
        amount: selectedAmount,
        notes: "Sedekah",
        sourceOfFund: DEFAULT_SOURCE,
        time: timestamp,
        isSedekah: "true",
      },
    });
  }, [selectedAmount, balance]);

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

        <Text className="text-sm text-gray-500 mb-2">
          Available Balance: Rp {formatCurrency(balance)}
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
