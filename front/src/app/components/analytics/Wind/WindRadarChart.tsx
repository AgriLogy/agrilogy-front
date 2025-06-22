import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { TickItem } from "recharts/types/util/types";


interface WindData {
  timestamp: string;
  value: number; // speed or direction value
  default_unit: string;
}

interface RadarPoint {
  angle: number; // direction in degrees (0-360)
  speed: number;
  timestamp: string;
}

const prepareRadarData = (
  speedData: WindData[],
  directionData: WindData[]
): RadarPoint[] => {
  const radarData: RadarPoint[] = [];

  // Match readings by timestamp and prepare data points
  for (let i = 0; i < Math.min(speedData.length, directionData.length); i++) {
    const speedReading = speedData[i];
    const directionReading = directionData[i];

    if (
      speedReading &&
      directionReading &&
      speedReading.timestamp === directionReading.timestamp &&
      typeof speedReading.value === "number" &&
      typeof directionReading.value === "number"
    ) {
      radarData.push({
        angle: directionReading.value,
        speed: speedReading.value,
        timestamp: speedReading.timestamp,
      });
    }
  }

  // Sort descending by timestamp (newest first)
  radarData.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Return only the last 10 entries
  return radarData.slice(0, 10);
};

// Tooltip showing angle, speed, timestamp
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("black", "white");

  if (active && payload && payload.length) {
    const data = payload[0].payload as RadarPoint;
    return (
      <Box bg={bg} color={color} p={3} borderRadius="md" boxShadow="lg">
        <Text fontWeight="bold">Direction: {data.angle.toFixed(1)}°</Text>
        <Text>Vitesse : {data.speed.toFixed(2)} m/s</Text>
        <Text>Timestamp : {data.timestamp}</Text>
      </Box>
    );
  }

  return null;
};

const WindRadarChart = ({
  windSpeedData,
  windDirectionData,
  loading,
}: {
  windSpeedData: WindData[];
  windDirectionData: WindData[];
  loading: boolean;
}) => {
  const chartData = prepareRadarData(windSpeedData, windDirectionData);
  const textColor = useColorModeValue("gray.800", "gray.200");
  
  // const ticks: TickItem[] = [0, 45, 90, 135, 180, 225, 270, 315];
  const ticks = [
    { value: 0 },
    { value: 45 },
    { value: 90 },
    { value: 135 },
    { value: 180 },
    { value: 225 },
    { value: 270 },
    { value: 315 },
  ];
  

  return (
    <Box width="100%" pr={4} pb={4} height="300px">
      <Text fontSize="xl" fontWeight="bold" color={textColor} mb={4}>
        Radar du vent (10 dernières valeurs)
      </Text>

      {loading ? (
        <Text>Chargement...</Text>
      ) : chartData.length === 0 ? (
        <Text>Aucune donnée disponible</Text>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarGrid />
            <PolarAngleAxis
              dataKey="angle"
              type="number"
              domain={[0, 360]}
              ticks={
                [0, 45, 90, 135, 180, 225, 270, 315] as unknown as TickItem[]
              }
              stroke={textColor}
              tickFormatter={(degree) => {
                const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
                const index = Math.round(degree / 45) % 8;
                return directions[index];
              }}
            />
            {/* <PolarRadiusAxis
              angle={30}
              domain={[0, Math.max(...chartData.map((d) => d.speed))]}
              stroke={textColor}
            /> */}
            <Tooltip content={(props) => <CustomTooltip {...props} />} />
            <Radar
              name="Vitesse"
              dataKey="speed"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default WindRadarChart;
