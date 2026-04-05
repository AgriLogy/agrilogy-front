'use client';
import React, { useMemo } from 'react';
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
import { useCalibratedStationChartRows } from '@/app/hooks/useCalibratedStationChartRows';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import { resolveAxisUnit } from '@/app/utils/unitOverrides';
import { useChartAxisColors } from '@/app/utils/useChartAxisColors';
// import { calculateET0 } from "../data/dashboard/calculateET0";

interface SensorDataChartProps {
  data: SensorData[];
}

const DASHBOARD_CHART_FIELDS = [
  { dataKey: 'temperature_weather', sensorKey: 'temperature_weather' },
  { dataKey: 'solar_radiation', sensorKey: 'solar_radiation' },
  { dataKey: 'et0', sensorKey: 'et0' },
] as const;

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
  useUnitOverridesRevision();

  const calibrated = useCalibratedStationChartRows(
    validData as unknown as Record<string, unknown>[],
    DASHBOARD_CHART_FIELDS
  );

  const lastEightData = useMemo(() => calibrated.slice(-8), [calibrated]);

  const tempUnit = resolveAxisUnit('temperature_weather');
  const solarUnit = resolveAxisUnit('solar_radiation');
  const et0Unit = resolveAxisUnit('et0');

  const chartColor = useColorModeValue('#4A90E2', '#90CDF4');
  const chartBg = useColorModeValue('white', 'gray.800');
  const { axis, grid } = useChartAxisColors();
  const p = useBreakpointValue({ base: 2, md: 4 });
  const { colorMode } = useColorMode();

  const CustomTick = ({ x, y, payload }: any) => (
    <text x={x} y={y} textAnchor="middle" fill={axis} fontSize="10">
      {payload.value}
    </text>
  );

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
          margin={{ top: 8, right: 72, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={grid} />
          <XAxis dataKey="timestamp" tick={<CustomTick />} />
          <YAxis
            yAxisId="temp"
            orientation="left"
            tick={<CustomTick />}
            label={{ value: tempUnit, angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="solar"
            orientation="right"
            tick={<CustomTick />}
            width={48}
            label={{ value: solarUnit, angle: 90, position: 'insideRight' }}
          />
          <YAxis
            yAxisId="et0"
            orientation="right"
            tick={<CustomTick />}
            width={48}
            offset={56}
            label={{ value: et0Unit, angle: 90, position: 'insideRight' }}
          />
          <Tooltip content={<UnifiedTooltip valuesAlreadyCalibrated />} />
          <Legend content={<CustomLegend />} />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temperature_weather"
            stroke={chartColor}
            name={`Température de l'air (${tempUnit})`}
          />
          <Line
            yAxisId="solar"
            type="monotone"
            dataKey="solar_radiation"
            stroke="#82ca9d"
            name={`Rayonnement solaire (${solarUnit})`}
          />
          <Line
            yAxisId="et0"
            type="monotone"
            dataKey="et0"
            stroke="#ffc658"
            name={`ET₀ (${et0Unit})`}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SensorDataChart;
