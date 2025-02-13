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

interface VaporPressureDeficitGraphProps {
  data: {
    timestamp: string;
    pressure_weather: number;
  }[];
}

// Custom legend component
const CustomLegend = (props: any) => (
  <ul
    style={{
      display: "flex",
      listStyle: "none",
      padding: 0,
      flexWrap: "wrap",
      margin: 0,
      marginLeft: 60,
    }}
  >
    {props.payload.map((entry: any, index: number) => (
      <li
        key={`item-${index}`}
        style={{
          marginRight: "15px",
          fontSize: "12px",
          color: entry.color,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            marginRight: "5px",
            backgroundColor: entry.color,
            width: "10px",
            height: "10px",
            display: "inline-block",
          }}
        />
        {entry.value}
      </li>
    ))}
  </ul>
);

// Custom tick component
const CustomTick = ({ x, y, payload }: any) => (
  <text x={x} y={y} textAnchor="middle" fill="#666" fontSize="10">
    {payload.value}
  </text>
);

// Custom tooltip for displaying data
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "5px",
          borderRadius: "5px",
          color: "rgba(54, 162, 235, 1)",
        }}
      >
        <p>{`Timestamp: ${payload[0].payload.timestamp}`}</p>
        <p>{`Vapor Pressure Deficit: ${payload[0].value} kPa`}</p>
      </div>
    );
  }
  return null;
};

const VaporPressureDeficitGraph = ({ data }: { data: any }) => {
  const { colorMode } = useColorMode();
  const chartBg = colorMode === "light" ? "white" : "gray.800";

  return (
    <Box
      width="100%"
      height="100%"
      bg={chartBg}
      borderRadius="md"
      boxShadow="lg"
      p={2}
    >
      <Text
        color={colorMode === "light" ? "gray.700" : "gray.200"}
        fontSize="lg"
        fontWeight="bold"
        mb={4}
      >
        {data.sensor_names?.et0}
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.sensor_data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="pressure_weather"
            stroke="rgba(54, 162, 235, 1)"
            name="Vapor Pressure Deficit (kPa)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default VaporPressureDeficitGraph;
