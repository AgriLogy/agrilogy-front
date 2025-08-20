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
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { WaterSoilData } from "./WaterSoilMain";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { FaCamera, FaDownload } from "react-icons/fa";
import useColorModeStyles from "@/app/utils/useColorModeStyles";

const WaterSoilChart = ({ data }: { data: WaterSoilData[] }) => {
  const labelInterval = useBreakpointValue({
    base: Math.ceil(data.length / 3),
    md: Math.ceil(data.length / 5),
  });

  const labelAngle = useBreakpointValue({ base: -3, md: 5 });
  const chartRef = useRef<HTMLDivElement>(null);

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement("a");
      link.download = "water_soil_data.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      "timestamp,value\n" +
      data.map((d) => `${d.timestamp},${d.waterFlow}`).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "water_soil_data.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const { textColor } = useColorModeStyles();

  return (
    <Box width="100%" height="100%" >
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" mb={4} color={textColor}>
          {/* Évolution de l'humidité du sol et du débit d'eau */}
          Eau disponible
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
      <Box ref={chartRef}>
        <ResponsiveContainer width="100%" height={300}>
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
                // value: "Humidité (%)",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, "auto"]}
              label={{
                value: "Débit (L/ss)",
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
    </Box>
  );
};

export default WaterSoilChart;
