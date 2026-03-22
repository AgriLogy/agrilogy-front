'use client';
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

const TempHumidityGraph = ({ data }: { data: any }) => {
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
        {data?.sensor_names?.temperature_humidity_weather}
      </Text>
      <ChartStateView loading={loading} empty={empty} height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 16, right: 24, left: 8, bottom: 40 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<UnifiedTooltip />} />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={<ChartLegend />}
            />
            <Line
              type="monotone"
              dataKey="temperature_weather"
              stroke={data.sensor_colors?.temperature_weather_color}
              name="Température (°C)"
              {...defaultLineProps}
            />
            <Line
              type="monotone"
              dataKey="humidity_weather"
              stroke={data.sensor_colors?.humidity_weather_color}
              name="Humidité (%)"
              {...defaultLineProps}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default TempHumidityGraph;
