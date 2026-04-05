'use client';
import { Box, Text } from '@chakra-ui/react';
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
  ReferenceLine,
} from 'recharts';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
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

const WIND_DIR_FIELDS = [
  { dataKey: 'wind_direction', sensorKey: 'wind_direction' },
] as const;

const WindDirectionGraph = ({ data }: { data: any }) => {
  const { bg, textColor } = useColorModeStyles();
  const { axis, grid } = useChartAxisColors();
  useUnitOverridesRevision();

  const CustomTick = ({ x, y, payload }: any) => (
    <text x={x} y={y} textAnchor="middle" fill={axis} fontSize="10">
      {payload.value}
    </text>
  );
  const loading = !data;
  const empty =
    !!data &&
    (!data.sensor_data ||
      (Array.isArray(data.sensor_data) && data.sensor_data.length === 0));

  const chartRows = useCalibratedStationChartRows(
    data?.sensor_data,
    WIND_DIR_FIELDS
  );
  const dirUnit = resolveAxisUnit('wind_direction');

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
              domain={[0, 360]}
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

            {/* Reference lines for cardinal directions */}
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

            {/* Line for Wind Direction */}
            <Line
              type="monotone"
              dataKey="wind_direction"
              stroke={data.sensor_colors?.wind_direction_color}
              name={`Wind direction (${dirUnit})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default WindDirectionGraph;
