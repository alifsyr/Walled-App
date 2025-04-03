import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Menu, Text } from "react-native-paper";

type ChartType = "pie" | "bar";
type FilterType = "weekly" | "monthly" | "quarterly";

interface ChartSwitcherProps {
  chartType: ChartType;
  onChartChange: (type: ChartType) => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function ChartSwitcher({
  chartType,
  onChartChange,
  filter,
  onFilterChange,
}: ChartSwitcherProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible((prev) => !prev);
  const closeMenu = () => setMenuVisible(false);

  const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
  ];

  return (
    <View className="flex-row justify-around items-center px-2 mb-2 gap-4">
      {/* Filter Dropdown */}
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        style={{ marginTop: 40 }}
        contentStyle={{
          backgroundColor: "#E5E7EB",
          borderRadius: 10,
          shadowOpacity: 0.1,
          shadowRadius: 5,
        }}
        anchor={
          <TouchableOpacity
            onPress={toggleMenu}
            className="px-4 p-2 py-2 bg-gray-200 rounded-lg"
          >
            <Text className="text-sm font-medium capitalize">{filter}</Text>
          </TouchableOpacity>
        }
      >
        {FILTER_OPTIONS.map((option) => (
          <Menu.Item
            key={option.value}
            onPress={() => {
              onFilterChange(option.value);
              closeMenu();
            }}
            title={option.label}
          />
        ))}
      </Menu>

      {/* Chart Type Toggle */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => onChartChange("pie")}
          className={`p-2 rounded-lg ${
            chartType === "pie" ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          <FontAwesome
            name="pie-chart"
            size={16}
            color={chartType === "pie" ? "white" : "black"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onChartChange("bar")}
          className={`p-2 rounded-lg ${
            chartType === "bar" ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          <FontAwesome
            name="bar-chart"
            size={16}
            color={chartType === "bar" ? "white" : "black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
