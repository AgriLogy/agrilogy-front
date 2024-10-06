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
  ReferenceLine,
} from "recharts";
import useColorModeStyles from "@/app/utils/useColorModeStyles"; // Import the utility

interface WindDirectionGraphProps {
  data: {
    formatted_timestamp: string;
    wind_direction: number;
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

const WindDirectionGraph: React.FC<WindDirectionGraphProps> = ({ data }) => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility for styles

  return (
    <Box width="100%" height="100%" bg={bg} borderRadius="md" boxShadow="lg" p={2}>
      <Text color={textColor} fontSize="lg" fontWeight="bold" mb={4}>
        Wind Direction
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="formatted_timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} domain={[0, 360]} />
          <Tooltip />
          <Legend content={<CustomLegend />} />
          
          {/* Reference lines for cardinal directions */}
          <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" label="N" />
          <ReferenceLine y={90} stroke="green" strokeDasharray="3 3" label="E" />
          <ReferenceLine y={180} stroke="blue" strokeDasharray="3 3" label="S" />
          <ReferenceLine y={270} stroke="orange" strokeDasharray="3 3" label="W" />

          {/* Line for Wind Direction */}
          <Line type="monotone" dataKey="wind_direction" stroke="rgba(255, 159, 64, 1)" name="Wind Direction (°)" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default WindDirectionGraph;
