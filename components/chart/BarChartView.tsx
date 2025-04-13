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

interface Props {
  data: {
    month: string; // sumbu X
    income: number; // nilai Y untuk income
    expense: number; // nilai Y untuk expense
  }[];
}

export default function BarChartView({ data }: Props) {
  const screenWidth = Dimensions.get("window").width * 0.8;
  const barWidthPerItem = 5;
  const chartWidth = Math.max(screenWidth, data.length * barWidthPerItem);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ width: chartWidth }}>
        <VictoryChart
          domainPadding={30}
          height={280}
          padding={{ top: 30, bottom: 80, left: 10, right: 5 }}
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
            tickValues={data.map((d) => d.month)}
            style={{
              tickLabels: {
                angle: -45,
                fontSize: 10,
                padding: 15,
              },
            }}
          />

          {/* 
            VictoryGroup tanpa colorScale,
            agar tiap VictoryBar bisa meng-handle labels dengan benar 
          */}
          <VictoryGroup offset={20}>
            <VictoryBar
              data={data}
              x="month"
              y="income"
              style={{ data: { fill: "#22c55e" } }}
              labels={({ datum }) =>
                typeof datum.income === "number"
                  ? `Rp ${datum.income.toLocaleString("id-ID")}`
                  : ""
              }
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{ fill: "#f0f0f0" }}
                  style={{ fontSize: 10 }}
                  pointerLength={4}
                  constrainToVisibleArea
                />
              }
            />

            <VictoryBar
              data={data}
              x="month"
              y="expense"
              style={{ data: { fill: "#ef4444" } }}
              labels={({ datum }) =>
                typeof datum.expense === "number"
                  ? `Rp ${datum.expense.toLocaleString("id-ID")}`
                  : ""
              }
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{ fill: "#f0f0f0" }}
                  style={{ fontSize: 10 }}
                  pointerLength={4}
                  constrainToVisibleArea
                />
              }
            />
          </VictoryGroup>
        </VictoryChart>
      </View>
    </ScrollView>
  );
}
