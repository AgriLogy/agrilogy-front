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
  defaultCartesianGridProps,
  defaultLineProps,
  defaultTooltipCursor,
  getDefaultXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';

interface SensorDataChartProps {
  data: SensorData[];
}

// Custom Legend Component
const CustomLegend = (props: any) => {
  return (
    <ul
      style={{
        display: 'flex',
        listStyle: 'none',
        padding: 0,
        flexWrap: 'wrap',
        margin: 0,
      }}
    >
      {props.payload.map((entry: any, index: number) => (
        <li
          key={`item-${index}`}
          style={{
            marginRight: '15px',
            fontSize: '12px',
            color: entry.color,
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              marginRight: '5px',
              backgroundColor: entry.color,
              width: '10px',
              height: '10px',
              display: 'inline-block',
            }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

const SensorDataChart: React.FC<SensorDataChartProps> = ({ data }) => {
  const validData = Array.isArray(data) && data.length > 0 ? data : [];

  // Calculate ET0 for each data point
  const dataWithET0 = validData.map((sensorData) => ({
    ...sensorData,
  }));

  const lastEightData = dataWithET0.slice(-8);
  const xAxisProps = getDefaultXAxisProps(lastEightData, 'timestamp');
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
          <XAxis
            dataKey="timestamp"
            {...xAxisProps}
            angle={0}
            textAnchor="middle"
            // interval={labelInterval}
          />
          <YAxis {...yAxisProps} />
          <Tooltip content={<UnifiedTooltip />} cursor={defaultTooltipCursor} />
          <Legend content={<CustomLegend />} />
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
            name="Rayonnement Solaire"
            {...defaultLineProps}
          />
          <Line
            type="monotone"
            dataKey="et0"
            stroke="#ffc658"
            name="ET0"
            {...defaultLineProps}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SensorDataChart;
