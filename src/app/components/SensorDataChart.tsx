'use client';
import React from 'react';
import {
  Box,
  Text,
  useColorModeValue,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SensorData } from '../data/dashboard/data';
import EmptyBox from './common/EmptyBox';
import UnifiedTooltip from './common/UnifiedTooltip';
import {
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultLegendWrapperStyle,
  defaultLineProps,
  defaultTooltipCursor,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';
import ChartLegend from './common/ChartLegend';

interface SensorDataChartProps {
  data: SensorData[];
}

const SensorDataChart: React.FC<SensorDataChartProps> = ({ data }) => {
  const validData = Array.isArray(data) && data.length > 0 ? data : [];

  // Calculate ET0 for each data point
  const dataWithET0 = validData.map((sensorData) => ({
    ...sensorData,
  }));

  const lastEightData = addTimeMsToChartRows(dataWithET0.slice(-8), 'timestamp');
  const xAxisProps = getAdaptiveTimeXAxisProps(lastEightData, 'timestamp');
  const yAxisProps = getDefaultYAxisProps(2);

  const chartColor = useColorModeValue('#4A90E2', '#90CDF4');
  const chartBg = useColorModeValue('white', 'gray.800');
  const p = useBreakpointValue({ base: 2, md: 4 });
  const { colorMode } = useColorMode();

  if (validData.length === 0) {
    return (
      // <Box
      //   width="100%"
      //   height="100%"
      //   bg={chartBg}
      //   borderRadius="md"
      //   boxShadow="lg"
      //   p={p}
      //   overflow="hidden"
      //   display="flex"
      //   alignItems="center"
      //   justifyContent="center"
      // >
      //   <Spinner size="xl" color="green.500" />
      // </Box>
      <EmptyBox />
    );
  }

  return (
    <Box
      width="100%"
      height="100%"
      bg={chartBg}
      borderRadius="md"
      boxShadow="lg"
      p={p}
      overflow="hidden"
    >
      <Text
        color={colorMode === 'light' ? 'gray.700' : 'gray.200'}
        fontSize="lg"
        fontWeight="bold"
        mb={4}
      >
        ET0 / H
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={lastEightData}
          margin={{ top: 16, right: 24, left: 8, bottom: 40 }}
        >
          <CartesianGrid {...defaultCartesianGridProps} />
          <XAxis {...xAxisProps} />
          <YAxis {...yAxisProps} />
          <Tooltip content={<UnifiedTooltip />} cursor={defaultTooltipCursor} />
          <Legend
            wrapperStyle={defaultLegendWrapperStyle}
            content={<ChartLegend />}
          />
          <Line
            type="monotone"
            dataKey="temperature_weather"
            stroke={chartColor}
            name="Température de l'air (°C)"
            {...defaultLineProps}
          />
          <Line
            type="monotone"
            dataKey="solar_radiation"
            stroke="#82ca9d"
            name="Rayonnement solaire (W/m²)"
            {...defaultLineProps}
          />
          <Line
            type="monotone"
            dataKey="et0"
            stroke="#ffc658"
            name="ET₀ (mm)"
            {...defaultLineProps}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SensorDataChart;
