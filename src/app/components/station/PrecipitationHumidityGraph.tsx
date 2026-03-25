'use client';
import { Box, Text, useColorMode } from '@chakra-ui/react';
import { useState } from 'react';
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
  defaultTooltipCursor,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';
import ChartLegend from '../common/ChartLegend';
import ChartStateView from '../common/ChartStateView';
import UnifiedTooltip from '../common/UnifiedTooltip';

const PrecipitationHumidityGraph = ({ data }: { data: any }) => {
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

  const [activeLines, setActiveLines] = useState({
    precipitation_rate: true,
    humidity_weather: true,
  });

  const handleLegendClick = (entry: any) => {
    const dataKey = entry?.dataKey ? String(entry.dataKey) : null;
    if (!dataKey) return;
    if (dataKey === 'precipitation_rate') {
      setActiveLines((prev) => ({
        ...prev,
        precipitation_rate: !prev.precipitation_rate,
      }));
    }
    if (dataKey === 'humidity_weather') {
      setActiveLines((prev) => ({
        ...prev,
        humidity_weather: !prev.humidity_weather,
      }));
    }
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
        {data?.sensor_names?.precipitation_humidity_rate}
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
            <Tooltip
              content={<UnifiedTooltip />}
              cursor={defaultTooltipCursor}
            />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={<ChartLegend onClick={handleLegendClick} />}
            />
            <Line
              type="monotone"
              dataKey="precipitation_rate"
              stroke={data?.sensor_colors?.precipitation_rate_color}
              name="Précipitation (mm)"
              {...defaultLineProps}
              hide={!activeLines.precipitation_rate}
            />
            <Line
              type="monotone"
              dataKey="humidity_weather"
              stroke={data?.sensor_colors?.humidity_weather_color}
              name="Humidité (%)"
              {...defaultLineProps}
              hide={!activeLines.humidity_weather}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default PrecipitationHumidityGraph;
