import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

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
        <View className="flex-row items-center justify-between border p-4 w-[350px] rounded-2xl bg-white border-white mt-6">
          <View className="flex-1">
            <Text className="text-black text-xl mb-1">Balance</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-black text-2xl font-bold">
                {showBalance
                  ? `Rp ${user.balance.toLocaleString()}`
                  : "Rp ******"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowBalance(!showBalance)}
                className="p-1"
              >
                <FontAwesome
                  name={showBalance ? "eye" : "eye-slash"}
                  size={16}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-col gap-5 mr-2">
            <TouchableOpacity className="bg-[#007BFF] w-10 h-10 rounded-lg justify-center items-center shadow-md">
              <FontAwesome name="plus" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#007BFF] w-10 h-10 rounded-lg justify-center items-center shadow-md"
              onPress={() => router.push("/transfer")}
            >
              <FontAwesome name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="mt-6 flex-1">
          <Text className="text-xl font-bold mb-4">Transaction History</Text>
          <View className="h-[300px]">
            <Text className="text-black text-3xl font-bold mb-4">
              Transaction History
            </Text>
            <ScrollView>
              <View className="border p-4 w-[350px] rounded-2xl bg-white border-gray-200 mb-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-black text-lg font-semibold">
                    Amazon
                  </Text>
                  <Text className="text-red-500 text-lg font-bold">
                    - Rp 500,000
                  </Text>
                </View>
                <Text className="text-gray-500 text-sm mt-1">12 Oct 2023</Text>
              </View>
              <View className="border p-4 w-[350px] rounded-2xl bg-white border-gray-200 mb-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-black text-lg font-semibold">
                    Salary
                  </Text>
                  <Text className="text-green-500 text-lg font-bold">
                    + Rp 10,000,000
                  </Text>
                </View>
                <Text className="text-gray-500 text-sm mt-1">10 Oct 2023</Text>
              </View>
              <View className="border p-4 w-[350px] rounded-2xl bg-white border-gray-200 mb-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-black text-lg font-semibold">
                    Starbucks
                  </Text>
                  <Text className="text-red-500 text-lg font-bold">
                    - Rp 50,000
                  </Text>
                </View>
                <Text className="text-gray-500 text-sm mt-1">9 Oct 2023</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}
