import { useMemo } from "react";
import { Transaction } from "@/types";

export const useChartData = (
  transactions: Transaction[],
  mode: "weekly" | "monthly" | "quarterly",
) => {
  return useMemo(() => {
    const now = new Date();

    // ------------------------
    // PIE CHART DATA FILTERING
    // ------------------------
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
      const date = new Date(t.date);
      return date >= pieStartDate && date <= now;
    });

    const income = pieFiltered
      .filter((t) => t.amount > 0)
      .reduce((a, b) => a + b.amount, 0);

    const expense = pieFiltered
      .filter((t) => t.amount < 0)
      .reduce((a, b) => a + Math.abs(b.amount), 0);

    const pieData = [
      { x: "Income", y: income, color: "#2f855a" },
      { x: "Expense", y: expense, color: "#c05621" },
    ];

    // ------------------------
    // BAR CHART GROUPING
    // ------------------------
    let barLabels: string[] = [];
    let groupedMap = new Map<string, { income: number; expense: number }>();

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

    // Bar chart periode: 6 minggu, 6 bulan, atau 3 bulan
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
      const date = new Date(t.date);
      return date >= barStartDate && date <= now;
    });

    barFiltered.forEach((t) => {
      const date = new Date(t.date);
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
        if (t.amount > 0) {
          group.income += t.amount;
        } else {
          group.expense += Math.abs(t.amount);
        }
      }
    });

    const barData = barLabels.map((label) => ({
      label,
      ...groupedMap.get(label)!,
    }));

    return {
      pieData,
      barData,
      income,
      expense,
      savingsPercentage:
        income === 0 ? 0 : Math.round(((income - expense) / income) * 100),
    };
  }, [transactions, mode]);
};
