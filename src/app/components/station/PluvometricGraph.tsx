'use client';
import { Box, Text, useColorMode } from '@chakra-ui/react';
import { useCalibratedStationChartRows } from '@/app/hooks/useCalibratedStationChartRows';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import { resolveAxisUnit } from '@/app/utils/unitOverrides';
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
import ChartStateView from '../common/ChartStateView';
import UnifiedTooltip from '../common/UnifiedTooltip';
import { useChartAxisColors } from '@/app/utils/useChartAxisColors';

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

const PLUVIO_FIELDS = [
  { dataKey: 'precipitation_rate', sensorKey: 'precipitation_rate' },
] as const;

const PluvometricGraph = ({ data }: { data: any }) => {
  const { colorMode } = useColorMode();
  const { axis, grid } = useChartAxisColors();
  useUnitOverridesRevision();

  const CustomTick = ({ x, y, payload }: any) => (
    <text x={x} y={y} textAnchor="middle" fill={axis} fontSize="10">
      {payload.value}
    </text>
  );
  const chartBg = colorMode === 'light' ? 'white' : 'gray.800';
  const loading = !data;
  const empty =
    !!data &&
    (!data.sensor_data ||
      (Array.isArray(data.sensor_data) && data.sensor_data.length === 0));

  const chartRows = useCalibratedStationChartRows(
    data?.sensor_data,
    PLUVIO_FIELDS
  );
  const lineUnit = resolveAxisUnit('precipitation_rate');

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
        {data?.sensor_names?.pluviometrie ?? 'Pluviométrie'}
      </Text>
      <ChartStateView loading={loading} empty={empty} height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartRows}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis
              dataKey="timestamp"
              tick={<CustomTick />}
              stroke={axis}
              strokeWidth={1}
              axisLine={{
                stroke: axis,
                strokeWidth: 1,
              }}
              tickLine={{
                stroke: axis,
                strokeWidth: 1,
              }}
            />
            <YAxis
              tick={<CustomTick />}
              stroke={axis}
              strokeWidth={1}
              axisLine={{
                stroke: axis,
                strokeWidth: 1,
              }}
              tickLine={{
                stroke: axis,
                strokeWidth: 1,
              }}
            />
            <Tooltip content={<UnifiedTooltip valuesAlreadyCalibrated />} />
            <Legend content={<CustomLegend />} />
            {/* Line for Pluvometric Data */}
            <Line
              type="monotone"
              dataKey="precipitation_rate"
              stroke={data.sensor_colors?.precipitation_rate_color}
              name={`Précipitation (${lineUnit})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default PluvometricGraph;
