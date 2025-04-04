import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import PieChartView from "@/components/chart/PieChartView";
import BarChartView from "@/components/chart/BarChartView";
import ChartSwitcher from "@/components/chart/ChartSwitcher";
import { useChartData } from "@/hooks/useChartData";
import { formatCurrency } from "@/script/utils";

export const mockTransactions = [
  { id: 1, title: "Amazon", amount: -500000, date: "2025-03-30" },
  { id: 2, title: "Salary", amount: 15000000, date: "2025-03-30" },
  { id: 3, title: "Gojek", amount: -25000, date: "2025-04-01" },
  { id: 4, title: "Starbucks", amount: -50000, date: "2025-03-24" },
  { id: 5, title: "Freelance", amount: 2000000, date: "2025-03-22" },
  { id: 6, title: "Grab", amount: -100000, date: "2025-02-15" },
  { id: 7, title: "Bonus", amount: 3000000, date: "2025-02-10" },
  { id: 8, title: "Netflix", amount: -150000, date: "2025-01-20" },
  { id: 9, title: "Shopee", amount: -250000, date: "2025-01-15" },
  { id: 10, title: "Consulting", amount: 4000000, date: "2025-01-10" },
];

export default function Home() {
  const user = {
    name: "Chelsea",
    balance: 10000000,
    accountNumber: "100899",
  };

  const [showBalance, setShowBalance] = useState(false);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [filter, setFilter] = useState<"weekly" | "monthly" | "quarterly">(
    "monthly",
  );
  const [transactions] = useState(mockTransactions);

  const { barData, income, expense, savingsPercentage } = useChartData(
    transactions,
    filter,
  );

  return (
    <ScrollView
      className="flex-1 bg-[#FAFBFD]"
      contentContainerStyle={{ alignItems: "center", paddingBottom: 32 }}
    >
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

      {/* Account Number */}
      <View className="bg-[#0061FF] px-6 py-3 mt-6 rounded-xl w-[90%]">
        <Text className="text-white text-base font-medium">
          Account No. <Text className="font-bold">{user.accountNumber}</Text>
        </Text>
      </View>

      {/* Balance */}
      <View className="flex-row justify-between items-center bg-white p-4 rounded-2xl w-[90%] mt-4">
        <View>
          <Text className="text-lg text-gray-800 font-medium">Balance</Text>
          <View className="flex-row items-center gap-2 mt-1">
            <Text className="text-black text-2xl font-bold">
              {showBalance
                ? `Rp ${user.balance.toLocaleString("id-ID")}`
                : "Rp ******"}
            </Text>
            <TouchableOpacity onPress={() => setShowBalance((v) => !v)}>
              <FontAwesome
                name={showBalance ? "eye" : "eye-slash"}
                size={18}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="gap-3">
          <TouchableOpacity
            onPress={() => router.push("/topup")}
            className="w-10 h-10 bg-[#007BFF] rounded-lg justify-center items-center"
          >
            <FontAwesome name="plus" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/transfer")}
            className="w-10 h-10 bg-[#007BFF] rounded-lg justify-center items-center"
          >
            <FontAwesome name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Report Section */}
      <View className="w-[90%] bg-white mt-4 rounded-2xl">
        <View className="flex-row justify-between items-center px-4 pt-4">
          <Text className="text-lg font-bold">Your Spending</Text>
          <ChartSwitcher
            chartType={chartType}
            onChartChange={setChartType}
            filter={filter}
            onFilterChange={setFilter}
          />
        </View>

        <View className="p-4">
          {chartType === "pie" ? (
            <PieChartView
              savingsPercentage={savingsPercentage}
              income={income}
              expense={expense}
            />
          ) : (
            <BarChartView data={barData} />
          )}
        </View>
      </View>

      {/* Transaction History */}
      <View className="mt-6 h-[350px] w-[90%]">
        <Text className="text-xl font-bold mb-4">Transaction History</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {transactions.map((item) => {
            const isExpense = item.amount < 0;
            const textColor = isExpense ? "text-red-500" : "text-green-500";

            return (
              <View
                key={item.id}
                className="border p-4 rounded-2xl bg-white border-gray-200 mb-4"
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-black text-lg font-semibold">
                    {item.title}
                  </Text>
                  <Text className={`${textColor} text-lg font-bold`}>
                    {formatCurrency(item.amount)}
                  </Text>
                </View>
                <Text className="text-gray-500 text-sm mt-1">{item.date}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
