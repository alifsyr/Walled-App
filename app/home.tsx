import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

import PieChartView from "@/components/chart/PieChartView";
import BarChartView from "@/components/chart/BarChartView";
import ChartSwitcher from "@/components/chart/ChartSwitcher";
import { useChartData } from "@/hooks/useChartData";
import { formatCurrency, getToken } from "@/script/utils";
import api from "@/services/api"; // sesuaikan dengan path api.ts Anda

export default function Home() {
  // === State loading
  const [loading, setLoading] = useState(true);

  // === State tampilan chart
  const [showBalance, setShowBalance] = useState(false);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [filter, setFilter] = useState<"weekly" | "monthly" | "quarterly">(
    "monthly",
  );

  // === State data user
  const [user, setUser] = useState<{
    name: string;
    balance: number;
    accountNumber: string;
    walletId: number;
  } | null>(null);

  // === State data transaksi
  const [transactions, setTransactions] = useState<
    {
      id: number;
      transactionType: string;
      amount: number;
      recipientWalletId: number | null;
      transactionDate: string;
      description: string | null;
      walletId: number | null;
    }[]
  >([]);

  // === Gunakan useChartData untuk chart
  const { barData, income, expense, savingsPercentage } = useChartData(
    transactions,
    filter,
    user?.walletId ?? 0,
  );

  // === Fungsi fetch data user & transactions
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);

      // 1) Ambil data user dari endpoint /api/users/me
      const userRes = await api.get("/api/users/me");
      const userData = userRes.data;

      console.log("home");
      if (userRes.status === 404) {
        router.replace("/set-pin");
        return;
      }

      if (userData.responseCode !== 200) {
        throw new Error("Failed to fetch user profile");
      }

      const { fullName } = userData.data.user;
      const { balance, accountNumber, id } = userData.data.wallet || {
        balance: 0,
        accountNumber: "00000",
      };

      setUser({
        name: fullName,
        balance,
        accountNumber,
        walletId: id,
      });

      // 2) Ambil transaksi dari endpoint /api/transactions/me
      const trxRes = await api.get("/api/transactions/me");
      const trxData = trxRes.data;

      if (trxData.responseCode !== 200) {
        throw new Error("Failed to fetch transactions");
      }

      setTransactions(trxData.data || []);
    } catch (error) {
      console.warn("fetchUserData error:", error);
      // Jika error karena token invalid, router.replace("/") bisa dipanggil di interceptor api.ts
    } finally {
      setLoading(false);
    }
  }, []);

  // === load data sekali di mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // === Jika masih loading
  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#007BFF" />
        <Text className="mt-3 text-gray-500">Loading data...</Text>
      </View>
    );
  }

  // === Jika user null -> failed
  if (!user) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-red-500">Failed to load user data.</Text>
      </View>
    );
  }

  // === Render UI utama
  return (
    <ScrollView
      className="flex-1 bg-[#FAFBFD]"
      contentContainerStyle={{ alignItems: "center", paddingBottom: 32 }}
    >
      {/* Header Section */}
      <View className="flex-row">
        <View className="flex-col mt-5">
          <Text className="text-2xl font-bold">
            Welcome, {user.name.split(" ", 1)}
          </Text>
          <Text className="text-gray-500 w-[250px] mt-3 text-lg">
            Check all your incoming and outgoing transactions here
          </Text>
        </View>
        <View className="p-2 mt-5">
          <Image
            source={require("@/assets/images/logo.png")}
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
            // Asumsikan kamu sudah tahu userWalletId
            // misalnya userWalletId = 4 (dari user.me)
            const userWalletId = user.walletId; // misalnya

            // Cek apakah ini expense (keluar)
            // => recipientWalletId != userWalletId berarti uang keluar
            const isExpense =
              (item.recipientWalletId !== null &&
                item.recipientWalletId !== userWalletId) ||
              item.description === "Sedekah";

            // Warna nominal
            const textColor = isExpense ? "text-red-500" : "text-green-500";

            // Tanda plus/minus
            const sign = isExpense ? "-" : "";

            // Ubahan transactionType
            let displayType = item.transactionType;
            if (item.transactionType === "TOP_UP") {
              displayType = "Top Up";
            } else if (item.transactionType === "TRANSFER") {
              displayType = "Transfer";
            }

            // Pakai `item.description` jika ada, atau fallback ke displayType
            const title = item.description ?? displayType;

            // Format tanggal
            const dateStr = new Date(item.transactionDate).toLocaleString(
              "id-ID",
            );

            return (
              <View
                key={item.id}
                className="border p-4 rounded-2xl bg-white border-gray-200 mb-4"
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-black text-lg font-semibold">
                    {title}
                  </Text>

                  <Text className={`${textColor} text-lg font-bold`}>
                    {sign}
                    {formatCurrency(item.amount)}
                  </Text>
                </View>
                <Text className="text-gray-500 text-sm mt-1">{dateStr}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
