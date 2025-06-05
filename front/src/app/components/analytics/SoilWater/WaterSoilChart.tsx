import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Box, Text, useBreakpointValue } from "@chakra-ui/react";
import { WaterSoilData } from "./WaterSoilMain";

const WaterSoilChart = ({ data }: { data: WaterSoilData[] }) => {
  const labelInterval = useBreakpointValue({
    base: Math.ceil(data.length / 3),
    md: Math.ceil(data.length / 9),
  });

  const labelAngle = useBreakpointValue({ base: -15, md: -5 });

  return (
    <Box width="100%" height="100%">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Évolution de l'humidité du sol et du débit d'eau
      </Text>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            angle={labelAngle}
            textAnchor="middle"
            interval={labelInterval}
          />

          <YAxis
            yAxisId="left"
            domain={[0, 100]}
            label={{
              value: "Humidité (%)",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, "auto"]}
            label={{
              value: "Débit (L/s)",
              angle: 90,
              position: "insideRight",
              dx: 10,
            }}
          />

          <Tooltip />
          <Legend />

          {/* Soil moisture lines */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="soilLow"
            name="Humidité basse (%)"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="soilMedium"
            name="Humidité moyenne (%)"
            stroke="#82ca9d"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="soilHigh"
            name="Humidité haute (%)"
            stroke="#ffc658"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />

          {/* Water flow area */}
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="waterFlow"
            name="Débit d'eau (L/s)"
            fill="#b3e5fc"
            stroke="#0288d1"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default WaterSoilChart;
