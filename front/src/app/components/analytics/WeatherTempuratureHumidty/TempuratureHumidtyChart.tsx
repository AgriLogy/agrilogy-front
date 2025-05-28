import React, { useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
} from "recharts";
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaDownload, FaCamera } from "react-icons/fa";
import html2canvas from "html2canvas";
import EmptyBox from "../../common/EmptyBox";
import useColorModeStyles from "@/app/utils/useColorModeStyles";

interface WeatherData {
  id: number;
  timestamp: string;
  default_unit: string;
  available_units: string[];
  value: number;
  zone: number;
  user: number;
}

const TempuratureHumidtyChart = ({
  humidityData,
  temperatureData,
  loading,
}: {
  humidityData: WeatherData[];
  temperatureData: WeatherData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { textColor } = useColorModeStyles();

  const mergedData = humidityData.map((h) => {
    const tempEntry = temperatureData.find((t) => t.timestamp === h.timestamp);
    return {
      timestamp: h.timestamp,
      humidity: h.value,
      temperature: tempEntry?.value || null,
    };
  });

  const labelInterval = useBreakpointValue({
    base: Math.ceil(mergedData.length / 3),
    md: Math.ceil(mergedData.length / 9),
  });
  const labelAngle = useBreakpointValue({ base: -15, md: -5 });

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement("a");
      link.download = "weather_chart.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      "timestamp,humidity,temperature\n" +
      mergedData
        .map((d) => `${d.timestamp},${d.humidity},${d.temperature ?? ""}`)
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "weather_data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Évolution Température et Humidité
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
          <EmptyBox text="Chargement..." />
        ) : mergedData.length === 0 ? (
          <EmptyBox text="Pas de données disponibles" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mergedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                angle={labelAngle}
                textAnchor="middle"
                interval={labelInterval}
              />
              <YAxis
                label={{
                  value: "Valeurs",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 14,
                  dy: 80,
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidité (%)"
                stroke="#2C7A7B"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="temperature"
                name="Température (°C)"
                stroke="#D69E2E"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Brush dataKey="timestamp" height={30} stroke="#8884d8" travellerWidth={8} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default TempuratureHumidtyChart;
