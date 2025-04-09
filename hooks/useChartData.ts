import { useMemo } from "react";

export interface Transaction {
  id: number;
  transactionType: string;
  amount: number;
  recipientWalletId: number | null;
  transactionDate: string;
  description: string | null;
  walletId: number | null; // jadikan optional
}

interface ChartData {
  pieData: { x: string; y: number; color: string }[];
  barData: { label: string; income: number; expense: number }[];
  income: number;
  expense: number;
  savingsPercentage: number;
}

/**
 *
 * @param transactions - List of transactions
 * @param mode - 'weekly', 'monthly', or 'quarterly'
 * @param currentUserWalletId - the wallet ID of the current user
 *
 * Logic expense / income:
 * - expense = recipientWalletId != currentUserWalletId
 * - income = recipientWalletId == currentUserWalletId
 */
export const useChartData = (
  transactions: Transaction[],
  mode: "weekly" | "monthly" | "quarterly",
  currentUserWalletId: number,
): ChartData => {
  return useMemo(() => {
    const now = new Date();

    /**
     * Dapatkan awal periode untuk Pie Chart
     */
    const pieStartDate = (() => {
      const date = new Date();
      if (mode === "weekly") {
        date.setDate(date.getDate() - 7);
      } else if (mode === "monthly") {
        date.setMonth(date.getMonth() - 1);
      } else {
        // quarterly
        date.setMonth(date.getMonth() - 3);
      }
      return date;
    })();

    // Filter transactions untuk Pie Chart
    const pieFiltered = transactions.filter((t) => {
      const date = new Date(t.transactionDate);
      return date >= pieStartDate && date <= now;
    });

    // Income = recipientWalletId == currentUserWalletId || recepientWalletId == null
    const income = pieFiltered
      .filter(
        (t) =>
          t.recipientWalletId === currentUserWalletId ||
          t.recipientWalletId === null,
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    // Expense = recipientWalletId != currentUserWalletId || recepientWalletId != null
    const expense = pieFiltered
      .filter(
        (t) =>
          t.recipientWalletId !== null &&
          t.recipientWalletId !== currentUserWalletId,
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    // Pie Chart menampilkan total income & expense
    const pieData = [
      { x: "Income", y: income, color: "#2f855a" },
      { x: "Expense", y: expense, color: "#c05621" },
    ];

    // ------------------------
    // BAR CHART LABELS & GROUP
    // ------------------------
    const barLabels: string[] = [];
    const groupedMap = new Map<string, { income: number; expense: number }>();

    if (mode === "weekly") {
      // Buat label Week 1..6
      for (let i = 5; i >= 0; i--) {
        const label = `Week ${6 - i}`;
        barLabels.push(label);
        groupedMap.set(label, { income: 0, expense: 0 });
      }
    } else {
      // monthly => 6 label
      // quarterly => 3 label
      const count = mode === "monthly" ? 6 : 3;
      for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        const label = d.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        barLabels.push(label);
        groupedMap.set(label, { income: 0, expense: 0 });
      }
    }

    // Batas waktu bar
    const barStartDate = (() => {
      const d = new Date();
      if (mode === "weekly") {
        d.setDate(d.getDate() - 6 * 7);
      } else if (mode === "monthly") {
        d.setMonth(d.getMonth() - 6);
      } else {
        d.setMonth(d.getMonth() - 3);
      }
      return d;
    })();

    // Filter transaction sesuai bar timeframe
    const barFiltered = transactions.filter((t) => {
      const date = new Date(t.transactionDate);
      return date >= barStartDate && date <= now;
    });

    barFiltered.forEach((t) => {
      const date = new Date(t.transactionDate);
      let label = "";

      if (mode === "weekly") {
        // Hitung jarak
        const diffDays = Math.floor(
          (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
        );
        // total 42 hari => 6 minggu
        const weekIndex = Math.floor((6 * 7 - diffDays - 1) / 7);
        if (weekIndex >= 0 && weekIndex < 6) {
          label = `Week ${weekIndex + 1}`;
        }
      } else {
        label = date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
      }

      const group = groupedMap.get(label);
      if (group) {
        // Income
        if (
          t.recipientWalletId === currentUserWalletId ||
          t.recipientWalletId === null
        ) {
          group.income += t.amount;
        } else {
          // Expense
          group.expense += t.amount;
        }
      }
    });

    // Konversi groupedMap ke array
    const barData = barLabels.map((label) => ({
      label,
      ...groupedMap.get(label)!,
    }));

    // Hitung total income/expense
    const totalIncome = barData.reduce((acc, cur) => acc + cur.income, 0);
    const totalExpense = barData.reduce((acc, cur) => acc + cur.expense, 0);

    return {
      pieData,
      barData,
      income: totalIncome,
      expense: totalExpense,
      savingsPercentage:
        totalIncome === 0
          ? 0
          : Math.round(((totalIncome - totalExpense) / totalIncome) * 100),
    };
  }, [transactions, mode, currentUserWalletId]);
};
