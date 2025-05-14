import React, { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "@/app/lib/api";
import { SensorData } from "@/app/types";
import {
  useBreakpointValue,
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { FaAppleAlt, FaDownload, FaCamera } from "react-icons/fa";
import html2canvas from "html2canvas";

const FruitSizeChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  const xAxisName = "Taille des fruits";
  const yAxisName = "Taille (mm)";
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<SensorData[]>("/api/sensors/fruitsize/")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch fruit size data:", err))
      .finally(() => setLoading(false));
  }, []);

  const chartData = data.map((item) => ({
    name: item.timestamp,
    value: item.value,
    color: item.color || "#8884d8",
  }));

  const labelInterval = useBreakpointValue({
    base: Math.ceil(chartData.length / 3),
    md: Math.ceil(chartData.length / 9),
  });
  const labelAngle = useBreakpointValue({ base: -15, md: -5 });

  const latestData = data.length > 0 ? data[data.length - 1] : null;

  const fruitSize = latestData
    ? Math.max(30, Math.min(80, latestData.value))
    : 40;

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement("a");
      link.download = "fruit_chart.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      "timestamp,value\n" +
      data.map((d) => `${d.timestamp},${d.value}`).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "fruit_data.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      {/* Top Bar */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          Évolution de la taille des fruits
        </Text>
        <HStack spacing={3}>
          <Button
            leftIcon={<FaCamera />}
            colorScheme="teal"
            variant="outline"
            onClick={handleScreenshot}
          >
            Capture
          </Button>
          <Button
            leftIcon={<FaDownload />}
            colorScheme="blue"
            variant="solid"
            onClick={handleDownloadData}
          >
            Export CSV
          </Button>
        </HStack>
      </Flex>

      {/* Chart and Summary */}
      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        <Box ref={chartRef} flex="1" height="400px">
          {loading || data.length === 0 ? (
            <Text>Chargement...</Text>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  angle={labelAngle}
                  textAnchor="middle"
                  interval={labelInterval}
                />
                <YAxis
                  label={{
                    value: yAxisName,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  name={xAxisName}
                  fill="#82ca9d"
                  activeBar={<Rectangle fill="gold" stroke="purple" />}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>

        <Box
          bg="green.100"
          p={4}
          borderRadius="md"
          boxShadow="md"
          minW="250px"
          textAlign="center"
          alignSelf="center"
        >
          <Flex justify="center" align="center" mb={3}>
            <FaAppleAlt size={fruitSize} color="#d1495b" />
          </Flex>
          <Text fontWeight="bold" fontSize="lg">
            Dernière taille mesurée :
          </Text>
          <Text fontSize="2xl" color="green.700">
            {latestData ? `${latestData.value.toFixed(2)} mm` : "Aucune donnée"}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default FruitSizeChart;
