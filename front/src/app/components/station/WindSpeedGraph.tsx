"use client";
import { Box, Text } from "@chakra-ui/react";
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
import useColorModeStyles from "@/app/utils/useColorModeStyles"; // Import the utility

interface WindSpeedGraphProps {
  data: {
    timestamp: string;
    wind_speed: number;
  }[];
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

const WindSpeedGraph: React.FC<WindSpeedGraphProps> = ({ data }) => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility

  return (
    <Box
      width="100%"
      height="100%"
      bg={bg}
      borderRadius="md"
      boxShadow="lg"
      p={2}
    >
      <Text color={textColor} fontSize="lg" fontWeight="bold" mb={4}>
        Vitesse du vent
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip />
          <Legend content={<CustomLegend />} />
          {/* Line for Wind Speed */}
          <Line
            type="monotone"
            dataKey="wind_speed"
            stroke="rgba(75, 192, 192, 1)"
            name="Wind Speed (m/s)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default WindSpeedGraph;
