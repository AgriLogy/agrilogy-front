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

interface PrecipitationHumidityGraphProps {
  data: {
    formatted_timestamp: string; // Formatted timestamp
    precipitation: number; // Precipitation data (in mm)
    humidity: number; // Humidity data (in %)
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

const PrecipitationHumidityGraph: React.FC<PrecipitationHumidityGraphProps> = ({ data }) => {
  const { colorMode } = useColorMode();
  const chartBg = colorMode === "light" ? "white" : "gray.800";

  return (
    <Box width="100%" height="100%" bg={chartBg} borderRadius="md" boxShadow="lg" p={2}>
      <Text color={colorMode === "light" ? "gray.700" : "gray.200"} fontSize="lg" fontWeight="bold" mb={4}>
        Precipitation and Humidity
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="formatted_timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip />
          <Legend content={<CustomLegend />} />
          <Line type="monotone" dataKey="precipitation" stroke="rgba(75, 192, 192, 1)" name="Precipitation (mm)" />
          <Line type="monotone" dataKey="humidity" stroke="rgba(255, 159, 64, 1)" name="Humidity (%)" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PrecipitationHumidityGraph;
