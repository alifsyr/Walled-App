import React from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryAxis,
  VictoryLegend,
  VictoryTooltip,
} from "victory-native";
import { View, ScrollView, Dimensions } from "react-native";
import { formatCurrencyShort } from "@/script/utils";

interface Props {
  data: {
    label: string; // sumbu X
    income: number; // nilai Y untuk income
    expense: number; // nilai Y untuk expense
  }[];
}

export default function BarChartView({ data }: Props) {
  const screenWidth = Dimensions.get("window").width;
  const barWidthPerItem = 60;
  const chartWidth = Math.max(screenWidth, data.length * barWidthPerItem);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ width: chartWidth }}>
        <VictoryChart
          domainPadding={20}
          height={280}
          padding={{ top: 30, bottom: 80, left: 70, right: 30 }}
          width={chartWidth}
        >
          {/* Legend */}
          <VictoryLegend
            x={Dimensions.get("window").width / 2 - 100} // Center horizontally
            y={0}
            orientation="horizontal"
            centerTitle
            gutter={20}
            style={{
              labels: { fontSize: 12 },
            }}
            data={[
              { name: "Income", symbol: { fill: "#22c55e" } },
              { name: "Expense", symbol: { fill: "#ef4444" } },
            ]}
          />

          {/* X Axis */}
          <VictoryAxis
            tickValues={data.map((d) => d.label)}
            style={{
              tickLabels: {
                angle: -45,
                fontSize: 10,
                padding: 15,
              },
            }}
          />

          {/* Y Axis */}
          <VictoryAxis
            dependentAxis
            tickFormat={formatCurrencyShort}
            style={{
              tickLabels: { fontSize: 10 },
            }}
          />

          {/* 
            VictoryGroup tanpa colorScale,
            agar tiap VictoryBar bisa meng-handle labels dengan benar 
          */}
          <VictoryGroup offset={20}>
            <VictoryBar
              data={data}
              x="label"
              y="income"
              style={{ data: { fill: "#22c55e" } }}
              labels={({ datum }) => formatCurrencyShort(datum.income)}
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{ fill: "#f0f0f0" }}
                  style={{ fontSize: 10 }}
                  pointerLength={4}
                />
              }
            />

            {/* Bar untuk Expense */}
            <VictoryBar
              data={data}
              x="label"
              y="expense"
              style={{ data: { fill: "#ef4444" } }}
              labels={({ datum }) => formatCurrencyShort(datum.expense)}
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{ fill: "#f0f0f0" }}
                  style={{ fontSize: 10 }}
                  pointerLength={4}
                />
              }
            />
          </VictoryGroup>
        </VictoryChart>
      </View>
    </ScrollView>
  );
}
