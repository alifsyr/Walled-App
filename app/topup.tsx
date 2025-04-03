import React, { useState, useCallback } from "react";
import {
  Alert,
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

export default function Topup() {
  const [sourceOfFund, setSourceOfFund] = useState<string | undefined>();
  const [formattedAmount, setFormattedAmount] = useState("");
  const [notes, setNotes] = useState("");

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

  const isTopupDisabled = !sourceOfFund || !formattedAmount;

  const handleTopup = useCallback(() => {
    if (isTopupDisabled) return;

    const numericAmount = Number(formattedAmount.replace(/\./g, ""));
    const trimmedNotes = notes.trim() || "-";
    const trxType = "Top Up";
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
        amount: numericAmount,
        notes: trimmedNotes,
        time: timestamp,
        sourceOfFund: sourceOfFund,
      },
    });
  }, [formattedAmount, sourceOfFund, notes, isTopupDisabled]);

  console.log("sourceOfFund:", sourceOfFund);
  console.log("formattedAmount:", formattedAmount);
  console.log("Notes:", notes);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-[#FAFBFD] p-4">
        <View className="flex items-center gap-4">
          {/* Amount Section */}
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
            </View>
          </View>

          {/* Dropdown Section */}
          <View className="p-2 w-full max-w-md rounded-2xl bg-white">
            <InlineDropdown
              data={["Walled", "LinkAja", "OVO"]}
              onSelect={(value) => setSourceOfFund(value || "")}
              placeholder="Select Source of Fund"
            />
          </View>

          {/* Notes Section */}
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

        {/* Top Up Button Fixed at Bottom */}
        <View className="absolute bottom-10 left-4 right-4 items-center">
          <TouchableOpacity
            onPress={handleTopup}
            disabled={isTopupDisabled}
            className={`rounded-xl w-full max-w-md p-4 items-center ${
              isTopupDisabled ? "bg-gray-400" : "bg-[#0061FF]"
            }`}
          >
            <Text className="text-white font-bold text-lg">Top Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
