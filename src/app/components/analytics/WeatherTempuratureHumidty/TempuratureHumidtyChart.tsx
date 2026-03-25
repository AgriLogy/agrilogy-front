import React, { useRef, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Box, Flex, Text, Button, HStack } from '@chakra-ui/react';
import { FaDownload, FaCamera } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import ChartStateView from '../../common/ChartStateView';
import ChartLegend from '../../common/ChartLegend';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import {
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultLegendWrapperStyle,
  defaultLineProps,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
  defaultTooltipCursor,
} from '@/app/utils/chartAxisConfig';

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
  const [activeLines, setActiveLines] = useState({
    humidity: true,
    temperature: true,
  });

  const mergedData = addTimeMsToChartRows(
    humidityData.map((h) => {
      const tempEntry = temperatureData.find(
        (t) => t.timestamp === h.timestamp
      );
      return {
        timestamp: h.timestamp,
        humidity: h.value,
        temperature: tempEntry?.value || null,
      };
    }),
    'timestamp'
  );

  const xAxisProps = getAdaptiveTimeXAxisProps(mergedData, 'timestamp');
  const yAxisProps = getDefaultYAxisProps(2);

  const handleLegendClick = (entry: any) => {
    const key = entry.dataKey as keyof typeof activeLines;
    if (!key) return;
    setActiveLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'weather_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

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
            margin={{ top: 16, right: 35, left: 35, bottom: 20 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis
              yAxisId="left"
              {...yAxisProps}
              label={{
                value: '°C',
                position: 'insideLeft',
                dy: 0,
                dx: -40,
                fontSize: 14,
                fontFamily: 'Arial, sans-serif',
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              {...yAxisProps}
              label={{
                value: '%',
                angle: -90,
                position: 'insideLeft',
                dy: 0,
                dx: 70,
                fontSize: 14,
                fontFamily: 'Arial, sans-serif',
              }}
            />
            <Tooltip content={<UnifiedTooltip />} cursor={defaultTooltipCursor} />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              verticalAlign="bottom"
              align="center"
              content={<ChartLegend onClick={handleLegendClick} />}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="humidity"
              name="Humidité (%)"
              stroke="#2C7A7B"
              {...defaultLineProps}
              hide={!activeLines.humidity}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="temperature"
              name="Température (°C)"
              stroke="#D69E2E"
              {...defaultLineProps}
              hide={!activeLines.temperature}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default TempuratureHumidtyChart;
