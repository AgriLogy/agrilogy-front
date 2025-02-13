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

interface ConductivityData {
  timestamp: string;
  ec_soil_medium: number;
  // irrigation: number;
}

interface ConductivityIrrigationGraphProps {
  data: ConductivityData[];
}

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

const ConductivityIrrigationGraph = ({ sensorData }: { sensorData: any }) => {
  if (!sensorData) return <div>Loading...</div>;

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
        {sensorData.sensor_names?.soil_conductivity}
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sensorData.sensor_data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="ec_soil_medium"
            stroke="rgba(75,192,192,1)"
            name="Conductivité (mS/cm)"
          />
          {/* <Line type="monotone" dataKey="irrigation" stroke="rgba(153,102,255,1)" name="Irrigation (L)" /> */}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ConductivityIrrigationGraph;
