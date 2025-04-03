import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

const radius = 80;
const strokeWidth = 20;
const center = radius + strokeWidth;
const circumference = 2 * Math.PI * radius;

interface PieChartViewProps {
  income: number;
  expense: number;
  savingsPercentage: number;
}

export default function PieChartView({
  income,
  expense,
  savingsPercentage,
}: PieChartViewProps) {
  const total = income + expense;
  const expenseRatio = total > 0 ? expense / total : 0;
  const expenseDashOffset = circumference * (1 - expenseRatio);

  return (
    <View className="items-center w-full mt-6">
      <View style={styles.chartWrapper}>
        <Svg width={2 * center} height={2 * center}>
          {/* Background ring (green for leftover/income) */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#22c55e"
            fill="transparent"
            strokeWidth={strokeWidth}
          />

          {/* Expense arc overlay (red) */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#ef4444"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={expenseDashOffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${center}, ${center}`}
          />

          {/* White hole in center for donut style */}
          <Circle
            cx={center}
            cy={center}
            r={radius - strokeWidth / 2}
            fill="#fff"
          />
        </Svg>

        {/* Center text */}
        <View style={[StyleSheet.absoluteFill, styles.centerContent]}>
          <Text className="text-2xl font-bold text-black">
            {savingsPercentage}%
          </Text>
          <Text className="text-sm text-gray-500 mt-1">saving this period</Text>
        </View>
      </View>

      {/* Income/Expense summary */}
      <View className="flex-row justify-between w-[90%] mt-6">
        <View className="items-center">
          <Text className="text-sm text-gray-500">Income</Text>
          <Text className="text-green-500 font-bold text-lg">
            Rp {income.toLocaleString("id-ID")}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-sm text-gray-500">Expense</Text>
          <Text className="text-red-500 font-bold text-lg">
            Rp {expense.toLocaleString("id-ID")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrapper: {
    width: (radius + strokeWidth) * 2,
    height: (radius + strokeWidth) * 2,
    alignItems: "center",
    justifyContent: "center",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
});
