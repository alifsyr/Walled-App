import { useMemo } from "react";

export interface Transaction {
  id: number;
  transactionType: string;
  amount: number;
  recipientWalletId: number | null;
  transactionDate: string;
  description: string | null;
  walletId: number | null;
}

interface ChartData {
  pieData: { x: string; y: number; color: string }[];
  barData: { label: string; income: number; expense: number }[];
  income: number;
  expense: number;
  savingsPercentage: number;
}

export const useChartData = (
  transactions: Transaction[],
  mode: "weekly" | "monthly" | "quarterly",
  currentUserWalletId: number,
): ChartData => {
  return useMemo(() => {
    const now = new Date();

    const pieStartDate = (() => {
      const date = new Date();
      if (mode === "weekly") {
        date.setDate(date.getDate() - 7);
      } else if (mode === "monthly") {
        date.setMonth(date.getMonth() - 1);
      } else {
        date.setMonth(date.getMonth() - 3);
      }
      return date;
    })();

    const pieFiltered = transactions.filter((t) => {
      const date = new Date(t.transactionDate);
      return date >= pieStartDate && date <= now;
    });

    const income = pieFiltered
      .filter(
        (t) =>
          (t.recipientWalletId === currentUserWalletId ||
            t.recipientWalletId === null) &&
          t.description !== "Sedekah",
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expense = pieFiltered
      .filter(
        (t) =>
          t.recipientWalletId !== currentUserWalletId ||
          t.description === "Sedekah",
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    const pieData = [
      { x: "Income", y: income, color: "#2f855a" },
      { x: "Expense", y: expense, color: "#c05621" },
    ];

    const barLabels: string[] = [];
    const groupedMap = new Map<string, { income: number; expense: number }>();

    if (mode === "weekly") {
      for (let i = 5; i >= 0; i--) {
        const label = `Week ${6 - i}`;
        barLabels.push(label);
        groupedMap.set(label, { income: 0, expense: 0 });
      }
    } else {
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

    const barFiltered = transactions.filter((t) => {
      const date = new Date(t.transactionDate);
      return date >= barStartDate && date <= now;
    });

    barFiltered.forEach((t) => {
      const date = new Date(t.transactionDate);
      let label = "";

      if (mode === "weekly") {
        const diffDays = Math.floor(
          (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
        );
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
        if (
          (t.recipientWalletId === currentUserWalletId ||
            t.recipientWalletId === null) &&
          t.description !== "Sedekah"
        ) {
          group.income += t.amount;
        } else {
          group.expense += t.amount;
        }
      }
    });

    const barData = barLabels.map((label) => ({
      label,
      ...groupedMap.get(label)!,
    }));

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
