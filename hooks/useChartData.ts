import { useMemo } from "react";
import { Transaction } from "@/types";

export const useChartData = (
  transactions: Transaction[],
  mode: "weekly" | "monthly" | "quarterly",
) => {
  return useMemo(() => {
    const now = new Date();

    const filtered = transactions.filter((t) => {
      const date = new Date(t.date);
      const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      if (mode === "weekly") return diff <= 7;
      if (mode === "monthly") return diff <= 30;
      return diff <= 90; // quarterly
    });

    const income = filtered
      .filter((t) => t.amount > 0)
      .reduce((a, b) => a + b.amount, 0);
    const expense = filtered
      .filter((t) => t.amount < 0)
      .reduce((a, b) => a + Math.abs(b.amount), 0);

    const pieData = [
      { x: "Income", y: income, color: "#2f855a" },
      { x: "Expense", y: expense, color: "#c05621" },
    ];

    const barData = [
      { month: "Jan", income: 80, expense: 60 },
      { month: "Feb", income: 50, expense: 95 },
      { month: "Mar", income: 30, expense: 70 },
      { month: "Apr", income: 75, expense: 55 },
      { month: "Jun", income: 60, expense: 45 },
      { month: "Jul", income: 30, expense: 20 },
    ];

    return {
      pieData,
      barData,
      income,
      expense,
      savingsPercentage: Math.round(((income - expense) / income) * 100),
    };
  }, [transactions, mode]);
};
