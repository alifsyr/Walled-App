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

export default function Transfer() {
  const [selectedValue, setSelectedValue] = useState<string>();
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const formatToIDRCurrency = (text: string) => {
    const numeric = text.replace(/\D/g, "");
    if (!numeric) return "";
    const numberValue = Number(numeric);
    return numberValue.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleAmountChange = (text: string) => {
    setAmount(formatToIDRCurrency(text));
  };

  const handleNotesChange = (text: string) => {
    const limitedText = text.slice(0, 100);
    setNotes(limitedText);
  };

  const isTransferDisabled = !selectedValue || !amount;

  const handleTransfer = () => {
    if (isTransferDisabled) return;

    const numericAmount = Number(amount.replace(/\./g, ""));

    Alert.alert(
      "Transfer Confirmation",
      `Transfer Rp ${numericAmount.toLocaleString()} from ${selectedValue}\nNotes: ${notes || "(none)"}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            console.log("Transferring:", {
              source: selectedValue,
              amount: numericAmount,
              notes,
            });
            Alert.alert("Success", "Transfer completed!");
          },
        },
      ],
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-[#FAFBFD] p-4 relative">
        <View className="flex items-center gap-4 pb-20">
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
              onSelect={(value) => setSelectedValue(value || "")}
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

        {/* Transfer Button Fixed at Bottom */}
        <View className="absolute bottom-10 left-4 right-4 items-center">
          <TouchableOpacity
            onPress={handleTransfer}
            disabled={isTransferDisabled}
            className={`rounded-xl w-full max-w-md p-4 items-center ${
              isTransferDisabled ? "bg-gray-400" : "bg-blue-500"
            }`}
          >
            <Text className="text-white font-bold text-lg">Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
