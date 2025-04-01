import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

// Example of transaction data, as though returned from an API
const mockTransactions = [
  {
    id: 1,
    title: "Amazon",
    amount: -500000, // negative => expense
    date: "12 Oct 2023",
  },
  {
    id: 2,
    title: "Salary",
    amount: 10000000, // positive => income
    date: "10 Oct 2023",
  },
  {
    id: 3,
    title: "Starbucks",
    amount: -50000,
    date: "9 Oct 2023",
  },
  {
    id: 4,
    title: "Gojek",
    amount: -25000,
    date: "8 Oct 2023",
  },
  {
    id: 5,
    title: "Shopee",
    amount: -150000,
    date: "7 Oct 2023",
  },
];

export default function Home() {
  const user = {
    name: "John Doe",
    balance: 10000000,
    accountNumber: "1234567890",
    profileImage: require("@/assets/images/profile-pict.jpg"),
    accountType: "Personal Account",
  };

  const [showBalance, setShowBalance] = useState(false);

  // State to hold our transactions
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    // In a real app: fetch data from an API and store it in state
    // e.g.
    // fetch("https://api.example.com/transactions")
    //   .then((res) => res.json())
    //   .then((data) => setTransactions(data))
    //   .catch((err) => console.error(err));

    // For demo, use mock data
    setTransactions(mockTransactions);
  }, []);

  // Helper function to format with thousand separators and an IDR prefix
  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    const formatted = absAmount.toLocaleString("id-ID"); // e.g. "500,000" or "10,000,000"
    return `Rp ${formatted}`;
  };

  return (
    <View className="flex-1 bg-[#FAFBFD]">
      <View className="container flex-1 items-center w-full mt-4 px-4 ">
        {/* Header Section */}
        <View className="flex-row">
          <View className="flex-col mt-5">
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

        {/* Account Number Section */}
        <View className="flex-row border p-4 w-[350px] justify-between rounded-2xl bg-[#0061FF] border-[#0061FF] mt-6">
          <Text className="text-white text-xl">Account No. </Text>
          <Text className="text-white text-lg font-bold">
            {user.accountNumber}
          </Text>
        </View>

        {/* Balance Section */}
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
            <TouchableOpacity
              className="bg-[#007BFF] w-10 h-10 rounded-lg justify-center items-center"
              onPress={() => router.push("/topup")}
            >
              <FontAwesome name="plus" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#007BFF] w-10 h-10 rounded-lg justify-center items-center"
              onPress={() => router.push("/transfer")}
            >
              <FontAwesome name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* History Transaction Section */}
        <View className="mt-6 h-[410px]">
          <Text className="text-xl font-bold mb-4">Transaction History</Text>

          {/* Scrollable transaction list */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {transactions.map((item) => {
              const isExpense = item.amount < 0;
              const sign = isExpense ? "-" : "+";
              const textColor = isExpense ? "text-red-500" : "text-green-500";

              return (
                <View
                  key={item.id}
                  className="border p-4 w-[350px] rounded-2xl bg-white border-gray-200 mb-4"
                >
                  <View className="flex-row justify-between items-center">
                    {/* Transaction Title */}
                    <Text className="text-black text-lg font-semibold">
                      {item.title}
                    </Text>

                    {/* Transaction Amount (red for expense, green for income) */}
                    <Text className={`${textColor} text-lg font-bold`}>
                      {sign} {formatCurrency(item.amount)}
                    </Text>
                  </View>
                  {/* Transaction Date */}
                  <Text className="text-gray-500 text-sm mt-1">
                    {item.date}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
