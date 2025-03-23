import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function Home() {
  const user = {
    name: "John Doe",
    balance: 100000,
    accountNumber: "1234567890",
    profileImage: require("@/assets/images/profile-pict.jpg"),
    accountType: "Personal Account",
  };

  const [showBalance, setShowBalance] = useState(false);

  return (
    <View className="flex-1 bg-[#FAFBFD]">
      <View className="container flex items-center mx-auto mt-4">
        <View className="flex-row">
          <View className="flex-col mt-5 place-items-center">
            <Text className="text-2xl font-bold">
              Good Morning, {user.name.split(" ", 1)}
            </Text>
            <Text className="text-gray-500 w-[250px] mt-3 text-lg">
              Check all your incoming and outgoing transactions here
            </Text>
          </View>
          <View className="p-2 mt-5">
            <Image
              source={require("@/assets/images/sun.png")}
              className="w-[81px] h-[77px]"
            />
          </View>
        </View>
        <View className="flex-row border p-4 w-[350px] justify-between rounded-2xl bg-[#0061FF] border-[#0061FF] mt-6">
          <Text className="text-white text-xl">Account No. </Text>
          <Text className="text-white text-lg font-bold">
            {user.accountNumber}
          </Text>
        </View>
        <View className="flex-row border p-4 w-[350px] justify-between rounded-2xl bg-white border-white mt-6 shadow-md">
          <View className="flex-1">
            <Text className="text-black text-xl">Balance</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-black text-3xl font-bold">
                {showBalance
                  ? `Rp ${user.balance.toLocaleString()}`
                  : "Rp ******"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowBalance(!showBalance)}
                className="p-2"
              >
                <FontAwesome
                  name={showBalance ? "eye" : "eye-slash"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
