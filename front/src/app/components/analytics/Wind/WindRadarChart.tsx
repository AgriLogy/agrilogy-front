import React, { useRef } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import {
  Box,
  Text,
  Button,
  HStack,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { TickItem } from "recharts/types/util/types";
import { FaCamera, FaDownload } from "react-icons/fa";
import html2canvas from "html2canvas";

interface WindData {
  timestamp: string;
  value: number;
  default_unit: string;
}

interface RadarPoint {
  angle: number;
  speed: number;
  timestamp: string;
}

const prepareRadarData = (
  speedData: WindData[],
  directionData: WindData[]
): RadarPoint[] => {
  const radarData: RadarPoint[] = [];

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

  radarData.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return radarData.slice(0, 10);
};

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
  const chartRef = useRef<HTMLDivElement>(null);
  const chartData = prepareRadarData(windSpeedData, windDirectionData);
  const textColor = useColorModeValue("gray.800", "gray.200");

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement("a");
      link.download = "wind_radar_chart.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      "timestamp,angle,speed\n" +
      chartData
        .map(
          (d) => `${d.timestamp},${d.angle.toFixed(1)},${d.speed.toFixed(2)}`
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wind_radar_data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Radar du vent (10 dernières valeurs)
        </Text>
        <HStack spacing={2}>
          <Button
            aria-label="Capture graphique"
            colorScheme="teal"
            variant="ghost"
            onClick={handleScreenshot}
          >
            <FaCamera />
          </Button>
          <Button
            aria-label="Exporter CSV"
            colorScheme="blue"
            variant="ghost"
            onClick={handleDownloadData}
          >
            <FaDownload />
          </Button>
        </HStack>
      </Flex>

      <Box ref={chartRef} height="300px">
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
                  const directions = [
                    "N",
                    "NE",
                    "E",
                    "SE",
                    "S",
                    "SW",
                    "W",
                    "NW",
                  ];
                  const index = Math.round(degree / 45) % 8;
                  return directions[index];
                }}
              />
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
    </Box>
  );
};

export default WindRadarChart;
