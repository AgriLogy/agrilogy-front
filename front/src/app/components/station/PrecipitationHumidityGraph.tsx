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
    timestamp: string; // Formatted timestamp
    precipitation: number; // Precipitation data (in mm)
    humidity: number; // Humidity data (in %)
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
        }}
      >
        <p>{`Timestamp: ${payload[0].payload.timestamp}`}</p>
        <p style={{ color: "rgba(75, 192, 192, 1)" }}>
          {`Precipitation: ${payload[0].payload.precipitation} mm`}{" "}
        </p>
        <p
          style={{ color: "rgba(255, 159, 64, 1)" }}
        >{`Humidity: ${payload[1].payload.humidity} %`}</p>
      </div>
    );
  }
  return null;
};

const PrecipitationHumidityGraph: React.FC<PrecipitationHumidityGraphProps> = ({
  data,
}) => {
  const { colorMode } = useColorMode();
  const chartBg = colorMode === "light" ? "white" : "gray.800";

  // Conditional rendering if there's no data
  if (!data || data.length === 0) {
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
          No Data Available
        </Text>
      </Box>
    );
  }

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
        Précipitations et humidité
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="precipitation"
            stroke="rgba(75, 192, 192, 1)"
            name="Precipitation (mm)"
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="rgba(255, 159, 64, 1)"
            name="Humidity (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PrecipitationHumidityGraph;
