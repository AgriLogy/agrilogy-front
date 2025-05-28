import React, { useRef, useState } from "react";
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
  Text,
  Flex,
  HStack,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaCamera, FaDownload } from "react-icons/fa";
import html2canvas from "html2canvas";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import EmptyBox from "../../common/EmptyBox";

type SensorData = { timestamp: string; value: number };

const SensorLeafChart = ({
  temperatureData,
  moistureData,
  loading,
}: {
  temperatureData: SensorData[];
  moistureData: SensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { textColor } = useColorModeStyles();

  const combinedData = temperatureData.map((t) => {
    const moisturePoint = moistureData.find(
      (m) => m.timestamp === t.timestamp
    );
    return {
      name: t.timestamp,
      temperature: t.value,
      moisture: moisturePoint?.value ?? null,
    };
  });

  const labelInterval = useBreakpointValue({
    base: Math.ceil(combinedData.length / 3),
    md: Math.ceil(combinedData.length / 9),
  });

  const labelAngle = useBreakpointValue({ base: -15, md: -5 });

  const [activeLines, setActiveLines] = useState({
    temperature: true,
    moisture: true,
  });

  const handleLegendClick = (e: any) => {
    const key = e.dataKey as keyof typeof activeLines;
    setActiveLines((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement("a");
      link.download = "leaf_chart.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      "timestamp,temperature,moisture\n" +
      combinedData
        .map((d) => `${d.name},${d.temperature},${d.moisture}`)
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "leaf_data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Évolution de l'humidité et de la température des feuilles
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
        ) : combinedData.length === 0 ? (
          <EmptyBox text="Pas de données" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={combinedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={labelAngle}
                textAnchor="middle"
                interval={labelInterval}
              />
              <YAxis
                yAxisId="left"
                label={{
                  value: "Température (°C)",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 14,
                  dy: 50,
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Humidité (%)",
                  angle: -90,
                  position: "insideRight",
                  fontSize: 14,
                  dy: -50,
                }}
              />
              <Tooltip />
              <Legend onClick={handleLegendClick} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                name="Température (°C)"
                stroke={activeLines.temperature ? "#ff7300" : "gray"}
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="moisture"
                name="Humidité des feuilles (%)"
                stroke={activeLines.moisture ? "#007aff" : "gray"}
                strokeWidth={2}
                activeDot={{ r: 6 }}
                
              />
              <Brush
                dataKey="name"
                height={30}
                stroke="#8884d8"
                travellerWidth={8}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default SensorLeafChart;
