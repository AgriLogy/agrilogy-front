"use client";
import { Box, Spinner, Text, useColorMode } from "@chakra-ui/react";
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
        >{`Humidity: ${payload[1].payload.humidity_weather} %`}</p>
      </div>
    );
  }
  return null;
};

const PrecipitationHumidityGraph= ({ data }: { data: any }) => {

  const { colorMode } = useColorMode();
  const chartBg = colorMode === "light" ? "white" : "gray.800";

  if (!data) return <Spinner />;
 

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
        {data.sensor_names?.precipitation_humidity_rate}
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
            dataKey="precipitation_rate"
            stroke={data.sensor_colors?.precipitation_rate_color}
            name="Precipitation (mm)"
          />
          <Line
            type="monotone"
            dataKey="humidity_weather"
            stroke={data.sensor_colors?.humidity_weather_color}
            name="Humidity (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PrecipitationHumidityGraph;
