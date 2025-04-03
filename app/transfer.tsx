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

export default function Transfer() {
  const [sof, setSoF] = useState<string>();
  const [beneficiary, setBeneficiary] = useState<string>();
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

  const isTransferDisabled = !sof || !amount || !beneficiary;

  const handleTransfer = () => {
    if (isTransferDisabled) return;

    const numericAmount = Number(amount.replace(/\./g, ""));

    Alert.alert(
      "Transfer Confirmation",
      `Transfer Rp ${numericAmount.toLocaleString()} from ${sof}\nto ${beneficiary}\nNotes: ${notes || " - "}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            console.log("Transferring:", {
              source: sof,
              amount: numericAmount,
              notes: notes?.trim() || "-",
            });

            // Simulate success and redirect
            router.replace({
              pathname: "/transaction-status",
              params: {
                status: "success",
                type: "Transfer",
                beneficiary: beneficiary,
                source: sof,
                amount: numericAmount,
                notes: notes?.trim() || "-",
                time: new Date().toLocaleTimeString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                }),
              },
            });

            // If failure scenario is needed later:
            // router.replace({ pathname: "/transaction-status", params: { status: "failed" } });
          },
        },
      ],
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-[#FAFBFD] p-4 relative">
        <View className="flex items-center gap-4 pb-20">
          {/* Dropdown Destination Section */}
          <View className="p-2 w-full max-w-md rounded-2xl bg-[#0061FF]">
            <View className="flex-row items-center">
              <InlineDropdown
                label="To"
                containerColor="#0061FF"
                containerStyle={{ flexDirection: "row" }}
                containerSize={"90%"}
                fontSize={20}
                fontColor="#fff"
                data={["234789", "123456", "456789"]}
                onSelect={(value) => setBeneficiary(value || "")}
                placeholder="Beneficiary List"
              />
            </View>
          </View>

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
              placeholder="Source of Fund"
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
