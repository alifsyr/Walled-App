import React from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryAxis,
} from "victory-native";
import { View } from "react-native";

interface Props {
  data: {
    month: string;
    income: number;
    expense: number;
  }[];
}

export default function BarChartView({ data }: Props) {
  return (
    <View>
      <VictoryChart domainPadding={20} height={240}>
        <VictoryAxis tickValues={data.map((d) => d.month)} />
        <VictoryAxis dependentAxis tickFormat={(x) => `Rp ${x}`} />
        <VictoryGroup offset={20} colorScale={["#2f855a", "#c05621"]}>
          <VictoryBar data={data} x="month" y="income" />
          <VictoryBar data={data} x="month" y="expense" />
        </VictoryGroup>
      </VictoryChart>
    </View>
  );
}
