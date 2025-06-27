import React, { useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Box,
  Text,
  useBreakpointValue,
  useColorModeValue,
  Button,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { FaDownload, FaCamera } from "react-icons/fa";
import html2canvas from "html2canvas";

interface Et0Data {
  timestamp: string;
  value: number;
  default_unit: string;
}

const EC0Chart = ({
  weatherData,
  calculatedData,
  loading,
}: {
  weatherData: Et0Data[];
  calculatedData: Et0Data[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const chartData = weatherData.map((item, index) => {
    const calculated = calculatedData[index]?.value ?? null;
    return {
      name: item.timestamp,
      Weather: item.value,
      Calculated: calculated,
    };
  });

  const textColor = useColorModeValue("gray.800", "gray.200");
  const labelAngle = useBreakpointValue({ base: -3, md: 5 });
  const labelInterval = useBreakpointValue({
    base: Math.ceil(chartData.length / 3),
    md: Math.ceil(chartData.length / 5),
  });

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement("a");
      link.download = "et0_chart.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      "timestamp,Weather,Calculated\n" +
      chartData
        .map((d) => `${d.name},${d.Weather ?? ""},${d.Calculated ?? ""}`)
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "et0_data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%"  pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          ET0 Comparaison (Capteur vs Calculé)
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
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={labelAngle}
                textAnchor="middle"
                interval={labelInterval}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Weather" fill="#3182ce" name="ET0 Capteur" />
              <Bar dataKey="Calculated" fill="#e53e3e" name="ET0 Calculé" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default EC0Chart;
