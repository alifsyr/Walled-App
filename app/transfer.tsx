import React, { useState, useCallback, useEffect } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { router } from "expo-router";

import InlineDropdown from "@/components/InlineDropdown";
import { generateTransactionId, formatCurrency } from "@/script/utils";

// Constants
const MAX_NOTE_LENGTH = 100;
const BENEFICIARY_LIST = ["234789", "123456", "456789"];

export default function Transfer() {
  const [beneficiary, setBeneficiary] = useState<string>();
  const [formattedAmount, setFormattedAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [accountBalance, setAccountBalance] = useState<number>(0);

  // Simulate fetching account balance from an API
  useEffect(() => {
    const fetchBalance = async () => {
      // Replace with real API call later
      const mockBalance = 8000000;
      setAccountBalance(mockBalance);
    };

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

  const isTransferDisabled = !beneficiary || !formattedAmount;

  const handleTransfer = useCallback(() => {
    if (isTransferDisabled) return;

    const numericAmount = Number(formattedAmount.replace(/\./g, ""));
    const trimmedNotes = notes.trim() || "-";
    const trxType = "Transfer";
    const trxId = generateTransactionId(trxType);
    const timestamp = new Date().toLocaleTimeString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    // Navigate to PIN confirmation screen
    router.push({
      pathname: "/input-pin",
      params: {
        trxId,
        type: trxType,
        beneficiary,
        amount: numericAmount,
        notes: trimmedNotes,
        time: timestamp,
      },
    });
  }, [beneficiary, formattedAmount, notes, isTransferDisabled]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-[#FAFBFD] p-4">
        <View className="flex items-center gap-4 pb-20">
          {/* Beneficiary Dropdown */}
          <View className="p-2 w-full max-w-md rounded-2xl bg-[#0061FF]">
            <InlineDropdown
              label="To"
              containerColor="#0061FF"
              containerStyle={{ flexDirection: "row" }}
              containerSize="90%"
              fontSize={20}
              fontColor="#fff"
              data={BENEFICIARY_LIST}
              onSelect={(value) => setBeneficiary(value || "")}
              placeholder="Beneficiary List"
            />
          </View>

          {/* Amount */}
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

          {/* Notes */}
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

        {/* Transfer Button */}
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
