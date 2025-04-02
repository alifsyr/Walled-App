import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
} from "react-native";
import InlineDropdown from "@/components/InlineDropdown";
import { router } from "expo-router";

export default function Topup() {
  const [sof, setSoF] = useState<string | undefined>();
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/\D/g, "");
    if (!numericValue) {
      setAmount("");
      return;
    }

    const numberValue = Number(numericValue);

    const formatted = numberValue.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    setAmount(formatted);
  };

  const handleNotesChange = (text: string) => {
    const limitedText = text.slice(0, 100);
    setNotes(limitedText);
  };

  const isTopupDisabled = !sof || !amount;

  const handleTopup = () => {
    if (isTopupDisabled) return;

    const numericAmount = Number(amount.replace(/\./g, ""));

    Alert.alert(
      "Top Up Confirmation",
      `Top Up Rp ${numericAmount.toLocaleString("id-ID")} from ${sof || "-"}\nNotes: ${notes?.trim() || "-"}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            console.log("Top Upping:", {
              source: sof,
              amount: numericAmount,
              notes: notes?.trim() || "-",
            });

            Alert.alert("Success", "Top Up completed!", [
              {
                text: "OK",
                onPress: () => router.replace("/home"),
              },
            ]);
          },
        },
      ],
    );
  };

  console.log("SoF:", sof);
  console.log("Amount:", amount);
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
                  value={amount}
                />
              </View>
            </View>
          </View>

          {/* Dropdown Section */}
          <View className="p-2 w-full max-w-md rounded-2xl bg-white">
            <InlineDropdown
              data={["Walled", "LinkAja", "OVO"]}
              onSelect={(value) => setSoF(value || "")}
              placeholder="Select Source"
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
              isTopupDisabled ? "bg-gray-400" : "bg-blue-500"
            }`}
          >
            <Text className="text-white font-bold text-lg">Top Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
