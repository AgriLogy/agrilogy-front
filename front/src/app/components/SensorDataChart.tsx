"use client";
import React from "react";
import {
  Box,
  Text,
  useColorModeValue,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
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
import { SensorData } from "../data/dashboard/data"; 
import { calculateET0 } from "../data/dashboard/calculateET0";

interface SensorDataChartProps {
  data: SensorData[];
}

// Custom Legend Component
const CustomLegend = (props: any) => {
  return (
    <ul
      style={{
        display: "flex",
        listStyle: "none",
        padding: 0,
        flexWrap: "wrap",  // Allow wrapping of items
        margin: 0,         // Remove default margin
      }}
    >
      {props.payload.map((entry: any, index: number) => (
        <li
          key={`item-${index}`}
          style={{
            marginRight: "15px",
            fontSize: "12px",
            color: entry.color,
            whiteSpace: "nowrap", // Prevent text wrapping within each item
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
};


// Custom Tick Component for X and Y Axis
const CustomTick = ({ x, y, payload }: any) => {
  return (
    <text x={x} y={y} textAnchor="middle" fill="#666" fontSize="10">
      {payload.value}
    </text>
  );
};

const SensorDataChart: React.FC<SensorDataChartProps> = ({ data }) => {
  // Calculate ET0 for each data point
  const dataWithET0 = data.map((sensorData) => ({
    ...sensorData,
    et0: calculateET0(sensorData),
  }));

  const chartColor = useColorModeValue("#4A90E2", "#90CDF4");
  const chartBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const p = useBreakpointValue({ base: 2, md: 4 });
  const { colorMode } = useColorMode();


  return (
    <Box
      width="100%"
      height="100%"
      bg={chartBg}
      borderRadius="md"
      boxShadow="lg"
      p={p}
      overflow="hidden"
    >
      <Text  color={colorMode === "light" ? "gray.700" : "gray.200"} fontSize="lg" fontWeight="bold" mb={4}>
      ET0 / 10 minutes
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dataWithET0}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="hc_air_temperature"
            stroke={chartColor}
            name="Température de l'air"
          />
          <Line
            type="monotone"
            dataKey="solar_radiation"
            stroke="#82ca9d"
            name="Rayonnement Solaire"
          />
          <Line
            type="monotone"
            dataKey="et0"
            stroke="#ffc658"
            name="ET0"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SensorDataChart;
