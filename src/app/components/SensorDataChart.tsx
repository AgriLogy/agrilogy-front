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
// import { calculateET0 } from "../data/dashboard/calculateET0";

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

// Custom Tick Component for X and Y Axis
const CustomTick = ({ x, y, payload }: any) => {
  return (
    <text x={x} y={y} textAnchor="middle" fill="#666" fontSize="10">
      {payload.value}
    </text>
  );
};

const SensorDataChart: React.FC<SensorDataChartProps> = ({ data }) => {
  console.log('okay : ', data);
  // Ensure data is an array and not empty
  const validData = Array.isArray(data) && data.length > 0 ? data : [];

  // Calculate ET0 for each data point
  const dataWithET0 = validData.map((sensorData) => ({
    ...sensorData,
  }));

  // Slice to get only the last 8 entries
  const lastEightData = dataWithET0.slice(-8);

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
        <LineChart data={lastEightData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip content={<UnifiedTooltip />} />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="temperature_weather"
            stroke={chartColor}
            name="Température de l'air"
          />
          <Line
            type="monotone"
            dataKey="solar_radiation"
            stroke="#82ca9d"
            name="Rayonnement Solaire"
          />
          <Line type="monotone" dataKey="et0" stroke="#ffc658" name="ET0" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SensorDataChart;
