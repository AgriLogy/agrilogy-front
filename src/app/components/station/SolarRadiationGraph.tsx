'use client';
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
  defaultCartesianGridProps,
  defaultLineProps,
  defaultTooltipCursor,
  getDefaultXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';
import ChartStateView from '../common/ChartStateView';
import UnifiedTooltip from '../common/UnifiedTooltip';

const CustomLegend = (props: any) => (
  <ul
    style={{
      display: 'flex',
      listStyle: 'none',
      padding: 0,
      flexWrap: 'wrap',
      margin: 0,
      marginLeft: 60,
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

const SolarRadiationGraph = ({ data }: { data: any }) => {
  const { colorMode } = useColorMode();
  const chartBg = colorMode === 'light' ? 'white' : 'gray.800';
  const loading = !data;
  const empty =
    !!data &&
    (!data.sensor_data ||
      (Array.isArray(data.sensor_data) && data.sensor_data.length === 0));
  const chartData = data?.sensor_data ?? [];
  const xAxisProps = getDefaultXAxisProps(chartData, 'timestamp');
  const yAxisProps = getDefaultYAxisProps(2);

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
        {data?.sensor_names?.solar_radiation}
      </Text>
      <ChartStateView loading={loading} empty={empty} height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
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
            <Tooltip
              content={<UnifiedTooltip />}
              cursor={defaultTooltipCursor}
            />
            <Legend content={<CustomLegend />} />
            <Line
              type="monotone"
              dataKey="solar_radiation"
              stroke={data?.sensor_colors?.solar_radiation_color}
              name="Solar Radiation (W/m²)"
              {...defaultLineProps}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default SolarRadiationGraph;
