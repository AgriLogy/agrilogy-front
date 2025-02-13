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

const CustomTick = ({ x, y, payload }: any) => (
  <text x={x} y={y} textAnchor="middle" fill="#666" fontSize="10">
    {payload.value}
  </text>
);

const PluvometricGraph = ({ data }: { data: any }) => {
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
        {/* {data.sensor_names.precipitation_humidity_rate}
         */}
        {/* {data.sensor_names?.Pluviometrie} */}
        hadi khass twli bars
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.sensor_data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip />
          <Legend content={<CustomLegend />} />
          {/* Line for Pluvometric Data */}
          <Line
            type="monotone"
            dataKey="wind_speed"
            stroke="rgba(75, 192, 192, 1)"
            name="Rainfall (mm)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PluvometricGraph;
