'use client';
import React, { useState } from 'react';
import { Box, Text, useColorMode } from '@chakra-ui/react';
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
import {
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultLegendWrapperStyle,
  defaultLineProps,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
  defaultTooltipCursor,
} from '@/app/utils/chartAxisConfig';
import ChartLegend from '../common/ChartLegend';
import ChartStateView from '../common/ChartStateView';
import UnifiedTooltip from '../common/UnifiedTooltip';

const VaporPressureDeficitGraph = ({ data }: { data: any }) => {
  const { colorMode } = useColorMode();
  const chartBg = colorMode === 'light' ? 'white' : 'gray.800';
  const loading = !data;
  const empty =
    !!data &&
    (!data.sensor_data ||
      (Array.isArray(data.sensor_data) && data.sensor_data.length === 0));
  const chartData = addTimeMsToChartRows(data?.sensor_data ?? [], 'timestamp');

  const xAxisProps = getAdaptiveTimeXAxisProps(chartData, 'timestamp');
  const yAxisProps = getDefaultYAxisProps(2);

  const [showPressure, setShowPressure] = useState(true);

  const handleLegendClick = () => {
    setShowPressure((prev) => !prev);
  };

  return (
    <Box
      width="100%"
      height="100%"
      bg={chartBg}
      borderRadius="md"
      boxShadow="lg"
      p={2}
    >
      <Text
        color={colorMode === 'light' ? 'gray.700' : 'gray.200'}
        fontSize="lg"
        fontWeight="bold"
        mb={4}
      >
        Déficit de pression de vapeur (VPD)
      </Text>
      <ChartStateView loading={loading} empty={empty} height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 16, right: 24, left: 8, bottom: 40 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis
              {...yAxisProps}
              label={{
                value: 'Déficit de pression de vapeur (DPV) (kPa)',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 12, fill: '#64748b' },
              }}
            />
            <Tooltip
              content={<UnifiedTooltip valueUnit=" kPa" />}
              cursor={defaultTooltipCursor}
            />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={<ChartLegend onClick={handleLegendClick} />}
            />
            <Line
              type="linear"
              dataKey="pressure_weather"
              stroke={data.sensor_colors?.pressure_weather_color ?? '#3182ce'}
              name="Déficit de pression de vapeur (kPa)"
              {...defaultLineProps}
              hide={!showPressure}
              strokeLinejoin="miter"
              strokeLinecap="butt"
              activeDot={{
                r: 5,
                strokeWidth: 2,
                fill: data.sensor_colors?.pressure_weather_color ?? '#3182ce',
                stroke: '#fff',
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default VaporPressureDeficitGraph;
