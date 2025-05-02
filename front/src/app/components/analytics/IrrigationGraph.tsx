"use client";

import useColorModeStyles from "@/app/utils/useColorModeStyles";
import { Box, Spinner, Text } from "@chakra-ui/react";
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

// Custom legend
const CustomLegend = (props: any) => {
  return (
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
};

// Custom tick for axes
const CustomTick = ({ x, y, payload }: any) => (
  <text x={x} y={y + 10} textAnchor="middle" fill="#666" fontSize="10">
    {payload.value}
  </text>
);

// Helper to merge sensor arrays by timestamp
const mergeSensorData = (data: any) => {
  const map: Record<string, any> = {};

  const addToMap = (entries: any[], key: string) => {
    entries.forEach((entry) => {
      const time = entry.timestamp;
      if (!map[time]) map[time] = { timestamp: time };
      map[time][key] = entry.value;
    });
  };

  addToMap(data.soil_moisture_low || [], "soil_moisture_low");
  addToMap(data.soil_moisture_medium || [], "soil_moisture_medium");
  addToMap(data.soil_moisture_high || [], "soil_moisture_high");

  // Return sorted by timestamp
  return Object.values(map).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

const IrrigationGraph = ({ data }: { data: any }) => {
  const { bg, textColor } = useColorModeStyles();

  if (!data || !data.sensor_data) return <Spinner />;

  const chartData = mergeSensorData(data.sensor_data);

  return (
    <Box
      width="100%"
      height="100%"
      bg={bg}
      borderRadius="md"
      boxShadow="lg"
      p={4}
      overflow="hidden"
    >
      <Text color={textColor} fontSize="lg" fontWeight="bold" mb={4}>
        {data.sensor_names?.soil_irrigation || "Irrigation du sol (L)"}
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="soil_moisture_low"
            stroke={data.sensor_colors?.soil_moisture_low_color || "#8884d8"}
            name="Humidité 20 cm (%)"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="soil_moisture_medium"
            stroke={data.sensor_colors?.soil_moisture_medium_color || "#82ca9d"}
            name="Humidité 40 cm (%)"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="soil_moisture_high"
            stroke={data.sensor_colors?.soil_moisture_high_color || "#ffc658"}
            name="Humidité 60 cm (%)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default IrrigationGraph;
