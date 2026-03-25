'use client';
import { Box, Text } from '@chakra-ui/react';
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
  ReferenceLine,
} from 'recharts';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
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

const WindDirectionGraph = ({ data }: { data: any }) => {
  const { bg, textColor } = useColorModeStyles();
  const loading = !data;
  const empty =
    !!data &&
    (!data.sensor_data ||
      (Array.isArray(data.sensor_data) && data.sensor_data.length === 0));
  const chartData = addTimeMsToChartRows(data?.sensor_data ?? [], 'timestamp');
  const xAxisProps = getAdaptiveTimeXAxisProps(chartData, 'timestamp');
  const yAxisProps = {
    ...getDefaultYAxisProps(0),
    domain: [0, 360] as [number, number],
  };

  const [showWindDirection, setShowWindDirection] = useState(true);

  const handleLegendClick = () => {
    setShowWindDirection((prev) => !prev);
  };

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
        {data?.sensor_names?.wind_direction}
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

            <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" label="N" />
            <ReferenceLine
              y={90}
              stroke="green"
              strokeDasharray="3 3"
              label="E"
            />
            <ReferenceLine
              y={180}
              stroke="blue"
              strokeDasharray="3 3"
              label="S"
            />
            <ReferenceLine
              y={270}
              stroke="orange"
              strokeDasharray="3 3"
              label="W"
            />

            <Line
              type="monotone"
              dataKey="wind_direction"
              stroke={data?.sensor_colors?.wind_direction_color}
              name="Direction du vent (°)"
              {...defaultLineProps}
              hide={!showWindDirection}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default WindDirectionGraph;
