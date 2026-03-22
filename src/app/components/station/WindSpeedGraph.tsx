'use client';
import React from 'react';
import { Box, Text } from '@chakra-ui/react';
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
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import {
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultLegendWrapperStyle,
  defaultLineProps,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';
import ChartLegend from '../common/ChartLegend';
import ChartStateView from '../common/ChartStateView';
import UnifiedTooltip from '../common/UnifiedTooltip';

const WindSpeedGraph = ({ data }: { data: any }) => {
  const { bg, textColor } = useColorModeStyles();
  const loading = !data;
  const empty =
    !!data &&
    (!data.sensor_data ||
      (Array.isArray(data.sensor_data) && data.sensor_data.length === 0));
  const chartData = addTimeMsToChartRows(data?.sensor_data ?? [], 'timestamp');

  const xAxisProps = getAdaptiveTimeXAxisProps(chartData, 'timestamp');
  const yAxisProps = getDefaultYAxisProps(2);

  return (
    <Box
      width="100%"
      height="100%"
      bg={bg}
      borderRadius="md"
      boxShadow="lg"
      p={2}
    >
      <Text color={textColor} fontSize="lg" fontWeight="bold" mb={4}>
        Vitesse du vent
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
                value: 'Vitesse du vent (m/s)',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 12, fill: '#64748b' },
              }}
            />
            <Tooltip content={<UnifiedTooltip />} />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={<ChartLegend />}
            />
            <Line
              type="monotone"
              dataKey="wind_speed"
              stroke={data.sensor_colors?.wind_speed_color}
              name="Vitesse du vent (m/s)"
              {...defaultLineProps}
            />
            <Line
              type="monotone"
              dataKey="wind_gust"
              stroke={data.sensor_colors?.wind_gust_color ?? '#ed8936'}
              name="Ravale du vent (m/s)"
              strokeDasharray="5 5"
              {...defaultLineProps}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default WindSpeedGraph;
