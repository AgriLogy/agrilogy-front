"use client";
import { Box, Text, useColorMode } from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PluvometricGraphProps {
  data: {
    formatted_timestamp: string; // Should be formatted timestamp similar to previous graphs
    pluvometric: number;         // The pluvometric data (e.g., rainfall in mm)
  }[];
}

const CustomLegend = (props: any) => (
  <ul style={{ display: "flex", listStyle: "none", padding: 0, flexWrap: "wrap", margin: 0, marginLeft: 60 }}>
    {props.payload.map((entry: any, index: number) => (
      <li key={`item-${index}`} style={{ marginRight: "15px", fontSize: "12px", color: entry.color, whiteSpace: "nowrap" }}>
        <span style={{ marginRight: "5px", backgroundColor: entry.color, width: "10px", height: "10px", display: "inline-block" }} />
        {entry.value}
      </li>
    ))}
  </ul>
);

const CustomTick = ({ x, y, payload }: any) => (
  <text x={x} y={y} textAnchor="middle" fill="#666" fontSize="10">
    {payload.value}
  </text>
);

const PluvometricGraph: React.FC<PluvometricGraphProps> = ({ data }) => {
  const { colorMode } = useColorMode();
  const chartBg = colorMode === "light" ? "white" : "gray.800";

  return (
    <Box width="100%" height="100%" bg={chartBg} borderRadius="md" boxShadow="lg" p={2}>
      <Text color={colorMode === "light" ? "gray.700" : "gray.200"} fontSize="lg" fontWeight="bold" mb={4}>
        Pluvometric Data (Rainfall)
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="formatted_timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip />
          <Legend content={<CustomLegend />} />
          {/* Line for Pluvometric Data */}
          <Line type="monotone" dataKey="cumulative_rainfall" stroke="rgba(75, 192, 192, 1)" name="Rainfall (mm)" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PluvometricGraph;
