import React from "react";
import { View, Text, TextInput } from "react-native";
import InlineDropdown from "@/components/InlineDropdown";

export default function Transfer() {
  const [selectedValue, setSelectedValue] = React.useState<
    string | undefined
  >();

  return (
    <>
      <View className="flex-1 bg-[#FAFBFD] p-4">
        <View className="flex items-center gap-4">
          <View className="flex-row items-center justify-between p-4 w-full max-w-md rounded-2xl bg-white">
            <View className="flex-1">
              <Text className="text-gray-500 text-sm mb-2">Amount</Text>
              <View className="flex-row items-center">
                <Text className="text-black text-2xl font-bold mr-2">IDR</Text>
                <TextInput
                  className="text-black text-2xl font-bold flex-1 border-b border-gray-300"
                  placeholder="0"
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const formattedText = text.replace(/[^0-9]/g, "");
                  }}
                />
              </View>
            </View>
          </View>
          <View className="p-4 w-full max-w-md rounded-2xl bg-white">
            <InlineDropdown
              data={["BYOND Pay", "LinkAja", "OVO"]}
              onSelect={(value) => setSelectedValue(value)}
              placeholder="Select Source"
            />
          </View>
          <View className="flex-row items-center justify-between p-4 w-full max-w-md rounded-2xl bg-white">
            <View className="flex-1">
              <Text className="text-gray-500 text-sm mb-2">Notes</Text>
              <View className="flex-row items-center">
                <TextInput
                  className="text-black text-2xl font-bold flex-1 border-b border-gray-300"
                  placeholder=""
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const formattedText = text.replace(/[^0-9]/g, "");
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
