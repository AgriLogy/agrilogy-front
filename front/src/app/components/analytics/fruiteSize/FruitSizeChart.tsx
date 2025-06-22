import React, { useRef, useState } from "react";
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
import {
  useBreakpointValue,
  Box,
  Flex,
  Text,
  Button,
  HStack,
} from "@chakra-ui/react";
import { FaDownload, FaCamera } from "react-icons/fa";
import html2canvas from "html2canvas";
import { SensorData } from "@/app/types";
import EmptyBox from "../../common/EmptyBox";
import useColorModeStyles from "@/app/utils/useColorModeStyles";

const FruitSizeChart = ({
  data,
  loading,
}: {
  data: SensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(true);

  const chartData = data.map((item) => ({
    name: item.timestamp,
    value: item.value,
  }));

  const labelInterval = useBreakpointValue({
    base: Math.ceil(chartData.length / 3),
    md: Math.ceil(chartData.length / 5),
  });

  const labelAngle = useBreakpointValue({ base: -15, md: 15 });
  const { textColor } = useColorModeStyles();

  // Legend click handler
  const handleLegendClick = (data: any) => {
    if (data.value === "Taille des fruits") {
      setShowBar((prev) => !prev);
    }
  };

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
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Évolution de la taille des fruits
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
          <EmptyBox text="Chargement..." /> // Assuming you have an EmptyBox component
        ) : data.length === 0 ? (
          <EmptyBox text="Pas de données" /> // Assuming you have an EmptyBox component
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              onClick={(e) => {
                // optional: if you want to toggle bar by clicking legend label only
              }}
            >
              <XAxis
                dataKey="name"
                angle={labelAngle}
                textAnchor="middle"
                interval={labelInterval}
              />
              <YAxis
                label={{
                  // value: "Taille (mm)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend onClick={handleLegendClick} />
              <Bar
                dataKey="value"
                name="Taille des fruits (mm)"
                fill={showBar ? "#82ca9d" : "gray"}
                activeBar={
                  <Rectangle
                    fill={showBar ? "gold" : "gray"}
                    stroke={showBar ? "purple" : "gray"}
                  />
                }
                isAnimationActive={false}
                style={{
                  pointerEvents: showBar ? "auto" : "none",
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default FruitSizeChart;
