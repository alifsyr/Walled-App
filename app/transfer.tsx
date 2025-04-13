import React, { useState, useCallback, useEffect } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from "react-native";
import { router } from "expo-router";
import InlineDropdown from "@/components/InlineDropdown";
import { generateTransactionId, formatCurrency } from "@/script/utils";
import api from "@/services/api";
import { useUserStore } from "@/stores/useUserStore";

const MAX_NOTE_LENGTH = 100;

export default function Transfer() {
  const [beneficiaryList, setBeneficiaryList] = useState<
    { label: string; value: string }[]
  >([]);
  const [beneficiaryId, setBeneficiaryId] = useState<string>("");
  const [beneficiaryName, setBeneficiaryName] = useState<string>("");
  const [formattedAmount, setFormattedAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [accountBalance, setAccountBalance] = useState<number>(0);

  const fullName = useUserStore((state) => state.name);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/users");
        const users = res.data.data || [];
        const formatted = users
          .filter(
            (item: any) =>
              item.wallet?.accountNumber && item.user.fullName !== fullName,
          )
          .map((item: any) => {
            const account = item.wallet.accountNumber;
            const name = item.user.fullName.split(" ")[0];
            const walletId = item.wallet.id;
            return { label: `${account} - ${name}`, value: walletId };
          });
        setBeneficiaryList(formatted);
      } catch (err) {
        console.error("Error fetching users:", err);
        Alert.alert("Error", "Failed to fetch users.");
      }
    };

    const fetchBalance = async () => {
      try {
        const res = await api.get("/api/wallets/balance");
        const balance = res.data.data?.balance || 0;
        setAccountBalance(balance);
      } catch (err) {
        console.error("Error fetching balance:", err);
        Alert.alert("Error", "Failed to fetch balance.");
      }
    };

    fetchUsers();
    fetchBalance();
  }, []);

  const handleAmountChange = useCallback((text: string) => {
    const digitsOnly = text.replace(/\D/g, "");
    if (!digitsOnly) {
      setFormattedAmount("");
      return;
    }
    const numberValue = Number(digitsOnly);
    setFormattedAmount(formatCurrency(numberValue));
  }, []);

  const handleNotesChange = useCallback((text: string) => {
    setNotes(text.slice(0, MAX_NOTE_LENGTH));
  }, []);

  const isTransferDisabled = !beneficiaryId || !formattedAmount;

  const handleTransfer = useCallback(() => {
    if (isTransferDisabled) return;

    const numericAmount = Number(formattedAmount.replace(/\./g, ""));
    if (numericAmount < 10000) {
      Alert.alert("Invalid Amount", "Minimum amount Rp10.000");
      return;
    }
    if (numericAmount > accountBalance) {
      Alert.alert("Insufficient Balance", "You do not have enough balance.");
      return;
    }

    const trimmedNotes = notes.trim() || "-";
    const trxType = "Transfer";
    const trxId = generateTransactionId(trxType);
    const timestamp = new Date().toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
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
        type: trxType,
        beneficiaryId: beneficiaryId,
        beneficiaryName,
        amount: numericAmount,
        notes: trimmedNotes,
        time: timestamp,
      },
    });
  }, [
    beneficiaryId,
    beneficiaryName,
    formattedAmount,
    notes,
    isTransferDisabled,
    accountBalance,
  ]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-[#FAFBFD] p-4">
        <View className="flex items-center gap-4 pb-20">
          <View className="p-2 w-full max-w-md rounded-2xl bg-gray-200">
            <InlineDropdown
              label="To"
              containerColor="#e5e7eb"
              containerStyle={{ flexDirection: "row" }}
              containerSize="90%"
              fontSize={16}
              fontColor="#000"
              data={beneficiaryList}
              onSelect={(value) => {
                setBeneficiaryId(value || "");
                const selected = beneficiaryList.find(
                  (item) => item.value === value,
                );
                setBeneficiaryName(selected?.label || "");
              }}
              placeholder="Beneficiary Account Number"
            />
          </View>

          <View className="flex-row items-center justify-between p-4 w-full max-w-md rounded-2xl bg-white">
            <View className="flex-1">
              <Text className="text-gray-500 text-sm mb-2">Amount</Text>
              <View className="flex-row items-center">
                <Text className="text-black text-sm font-bold mr-2">IDR</Text>
                <TextInput
                  className="text-black text-2xl font-bold flex-1 border-gray-300"
                  placeholder="0"
                  keyboardType="numeric"
                  onChangeText={handleAmountChange}
                  value={formattedAmount}
                />
              </View>
              <Text className="text-gray-400 text-xs mt-2">
                Balance: Rp {formatCurrency(accountBalance)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between p-4 w-full max-w-md rounded-2xl bg-white">
            <View className="flex-1">
              <Text className="text-gray-500 text-sm mb-2">Notes</Text>
              <View className="flex-row items-center">
                <TextInput
                  className="text-black text-2xl font-bold flex-1 border-b border-gray-300"
                  placeholder=""
                  onChangeText={handleNotesChange}
                  value={notes}
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>
        </View>

        <View className="absolute bottom-10 left-4 right-4 items-center">
          <TouchableOpacity
            onPress={handleTransfer}
            disabled={isTransferDisabled}
            className={`rounded-xl w-full max-w-md p-4 items-center ${
              isTransferDisabled ? "bg-gray-400" : "bg-[#0061FF]"
            }`}
          >
            <Text className="text-white font-bold text-lg">Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
