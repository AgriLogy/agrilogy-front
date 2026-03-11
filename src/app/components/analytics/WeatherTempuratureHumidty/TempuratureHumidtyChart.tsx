import React, { useRef } from 'react';
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
} from 'recharts';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaDownload, FaCamera } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import ChartStateView from '../../common/ChartStateView';
import useColorModeStyles from '@/app/utils/useColorModeStyles';

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

  // Merging humidity and temperature data based on the timestamp
  const mergedData = humidityData.map((h) => {
    const tempEntry = temperatureData.find((t) => t.timestamp === h.timestamp);
    return {
      timestamp: h.timestamp,
      humidity: h.value,
      temperature: tempEntry?.value || null,
    };
  });

  // Label interval and angle adjustments for responsive chart
  const labelInterval = useBreakpointValue({
    base: Math.ceil(mergedData.length / 3),
    md: Math.ceil(mergedData.length / 9),
  });
  const _labelAngle = useBreakpointValue({ base: -3, md: 5 });

  // Screenshot capture function
  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'weather_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // CSV data export function
  const handleDownloadData = () => {
    const csv =
      'timestamp,humidity,temperature\n' +
      mergedData
        .map((d) => `${d.timestamp},${d.humidity},${d.temperature ?? ''}`)
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'weather_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Température et Humidité
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
      <ChartStateView
        loading={loading}
        empty={mergedData.length === 0}
        emptyText="Pas de données disponibles"
        chartRef={chartRef}
        height="300px"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={mergedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              angle={0}
              textAnchor="middle"
              interval={labelInterval}
              stroke="#666" // Axis line color
              strokeWidth={1} // Axis line thickness
              tick={{
                // Tick styling
                fill: '#666', // Tick label color
                fontSize: 17, // Tick label font size
                fontFamily: 'Arial, sans-serif', // Tick label font
              }}
              axisLine={{
                // Main axis line styling
                stroke: '#666',
                strokeWidth: 1,
              }}
              tickLine={{
                // Tick line styling
                stroke: '#666',
                strokeWidth: 1,
              }}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: 'Température (°C)',
                angle: -90,
                position: 'insideLeft',
                fontSize: 14,
                dy: 80,
              }}
              stroke="#666" // Axis line color
              strokeWidth={1} // Axis line thickness
              tick={{
                // Tick styling
                fill: '#666', // Tick label color
                fontSize: 17, // Tick label font size
                fontFamily: 'Arial, sans-serif', // Tick label font
              }}
              axisLine={{
                // Main axis line styling
                stroke: '#666',
                strokeWidth: 1,
              }}
              tickLine={{
                // Tick line styling
                stroke: '#666',
                strokeWidth: 1,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: 'Humidité (%)',
                angle: -90,
                position: 'insideRight',
                fontSize: 14,
                dx: 10,
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="humidity"
              name="Humidité (%)"
              stroke="#2C7A7B"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="temperature"
              name="Température (°C)"
              stroke="#D69E2E"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Brush
              dataKey="timestamp"
              height={30}
              stroke="#8884d8"
              travellerWidth={8}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default TempuratureHumidtyChart;
