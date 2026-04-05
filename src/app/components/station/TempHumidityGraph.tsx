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

const TEMP_HUM_FIELDS = [
  { dataKey: 'temperature_weather', sensorKey: 'temperature_weather' },
  { dataKey: 'humidity_weather', sensorKey: 'humidity_weather' },
] as const;

const TempHumidityGraph = ({ data }: { data: any }) => {
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
    TEMP_HUM_FIELDS
  );
  const tempUnit = resolveAxisUnit('temperature_weather');
  const humUnit = resolveAxisUnit('humidity_weather');

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
              yAxisId="left"
              tick={<CustomTick />}
              stroke={axis}
              strokeWidth={1}
              label={{
                value: tempUnit,
                angle: -90,
                position: 'insideLeft',
                style: { fill: axis, fontSize: 11 },
              }}
              axisLine={{ stroke: axis, strokeWidth: 1 }}
              tickLine={{ stroke: axis, strokeWidth: 1 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={<CustomTick />}
              stroke={axis}
              strokeWidth={1}
              label={{
                value: humUnit,
                angle: 90,
                position: 'insideRight',
                style: { fill: axis, fontSize: 11 },
              }}
              axisLine={{ stroke: axis, strokeWidth: 1 }}
              tickLine={{ stroke: axis, strokeWidth: 1 }}
            />
            <Tooltip content={<UnifiedTooltip valuesAlreadyCalibrated />} />
            <Legend content={<CustomLegend />} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temperature_weather"
              stroke={data.sensor_colors?.temperature_weather_color}
              name={`Temperature (${tempUnit})`}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="humidity_weather"
              stroke={data.sensor_colors?.humidity_weather_color}
              name={`Humidity (${humUnit})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default TempHumidityGraph;
