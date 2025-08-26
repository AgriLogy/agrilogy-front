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
  ReferenceArea, // ⬅️ add this
} from "recharts";
import {
  useBreakpointValue,
  Box,
  Flex,
  Text,
  Button,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaDownload, FaCamera } from "react-icons/fa";
import html2canvas from "html2canvas";
import EmptyBox from "../../common/EmptyBox";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import { TemperaturePoint } from "./SoilTemperatureMain";

const SoilTemperatureChart = ({
  data,
  loading,
  bestValueMin,
  bestValueMax,
}: {
  data: TemperaturePoint[];
  loading: boolean;
  bestValueMin: number;
  bestValueMax: number;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const [showLow, setShowLow] = useState(true);
  const [showMedium, setShowMedium] = useState(true);
  const [showHigh, setShowHigh] = useState(true);

  const chartData = data.map((d) => ({
    name: d.timestamp,
    low: d.low,
    medium: d.medium,
    high: d.high,
  }));

  const labelInterval = useBreakpointValue({
    base: Math.ceil(Math.max(chartData.length, 1) / 3),
    md: Math.ceil(Math.max(chartData.length, 1) / 5),
  });

  const labelAngle = useBreakpointValue({ base: -3, md: 5 });
  const { textColor } = useColorModeStyles();

  const bandFill = useColorModeValue("rgba(72,187,120,0.18)", "rgba(72,187,120,0.28)"); // green
  const bandStroke = useColorModeValue("rgba(56,161,105,0.8)", "rgba(154,230,180,0.9)");

  const handleLegendClick = (e: any) => {
    switch (e.value) {
      case "Basse":
        setShowLow((s) => !s);
        break;
      case "Moyenne":
        setShowMedium((s) => !s);
        break;
      case "Haute":
        setShowHigh((s) => !s);
        break;
      default:
        break;
    }
  };

  const handleScreenshot = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const a = document.createElement("a");
    a.download = "soil_temperature_chart.png";
    a.href = canvas.toDataURL();
    a.click();
  };

  const handleDownloadData = () => {
    const header = "timestamp,low,medium,high\n";
    const rows = data
      .map(
        (d) =>
          `${d.timestamp},${d.low ?? ""},${d.medium ?? ""},${d.high ?? ""}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "soil_temperature_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const xStart = chartData[0]?.name;
  const xEnd = chartData[chartData.length - 1]?.name;
  const showBand =
    typeof bestValueMin === "number" &&
    typeof bestValueMax === "number" &&
    bestValueMin < bestValueMax &&
    xStart &&
    xEnd;

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Température du sol (°C)
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
        ) : chartData.length === 0 ? (
          <EmptyBox text="Pas de données" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              {/* Y-band for ideal irrigation temperature */}
              {showBand && (
                <ReferenceArea
                  x1={xStart}
                  x2={xEnd}
                  y1={bestValueMin}
                  y2={bestValueMax}
                  fill={bandFill}
                  stroke={bandStroke}
                  strokeOpacity={1}
                  ifOverflow="extendDomain"
                />
              )}

              <XAxis
                dataKey="name"
                angle={labelAngle}
                textAnchor="middle"
                interval={labelInterval}
              />
              <YAxis
                label={{ angle: -90, position: "insideLeft" }}
                domain={["auto", "auto"]}
              />
              <Tooltip />
              <Legend onClick={handleLegendClick} />

              <Line
                type="monotone"
                dataKey="low"
                name="Basse"
                stroke={showLow ? "#3182CE" : "gray"}
                strokeWidth={2}
                dot={{ r: 3, fill: showLow ? "#3182CE" : "gray" }}
                hide={!showLow}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="medium"
                name="Moyenne"
                stroke={showMedium ? "#2F855A" : "gray"}
                strokeWidth={2}
                dot={{ r: 3, fill: showMedium ? "#2F855A" : "gray" }}
                hide={!showMedium}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="high"
                name="Haute"
                stroke={showHigh ? "#E53E3E" : "gray"}
                strokeWidth={2}
                dot={{ r: 3, fill: showHigh ? "#E53E3E" : "gray" }}
                hide={!showHigh}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default SoilTemperatureChart;
