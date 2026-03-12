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
import ChartStateView from '../common/ChartStateView';
import UnifiedTooltip from '../common/UnifiedTooltip';

// Custom legend component
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

// Custom tick component
const CustomTick = ({ x, y, payload }: any) => (
  <text x={x} y={y} textAnchor="middle" fill="#666" fontSize="10">
    {payload.value}
  </text>
);

const VaporPressureDeficitGraph = ({ data }: { data: any }) => {
  const { colorMode } = useColorMode();
  const chartBg = colorMode === 'light' ? 'white' : 'gray.800';
  const loading = !data;
  const empty =
    !!data &&
    (!data.sensor_data ||
      (Array.isArray(data.sensor_data) && data.sensor_data.length === 0));

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
        {data?.sensor_names?.et0}
      </Text>
      <ChartStateView loading={loading} empty={empty} height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data?.sensor_data ?? []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tick={<CustomTick />}
              stroke="#666" // Axis line color
              strokeWidth={1} // Axis line thickness
              // tick={{                          // Tick styling
              //   fill: '#666',                  // Tick label color
              //   fontSize: 17,                  // Tick label font size
              //   fontFamily: 'Arial, sans-serif' // Tick label font
              // }}
              axisLine={{
                // Main axis line styling
                stroke: '#666',
                strokeWidth: 1,
              }}
              tickLine={{
                // Tick line styling
                stroke: '#666',
                strokeWidth: 1,
              }}
            />
            <YAxis
              tick={<CustomTick />}
              stroke="#666" // Axis line color
              strokeWidth={1} // Axis line thickness
              // tick={{                          // Tick styling
              //   fill: '#666',                  // Tick label color
              //   fontSize: 17,                  // Tick label font size
              //   fontFamily: 'Arial, sans-serif' // Tick label font
              // }}
              axisLine={{
                // Main axis line styling
                stroke: '#666',
                strokeWidth: 1,
              }}
              tickLine={{
                // Tick line styling
                stroke: '#666',
                strokeWidth: 1,
              }}
            />
            <Tooltip content={<UnifiedTooltip valueUnit=" kPa" />} />
            <Legend content={<CustomLegend />} />
            <Line
              type="monotone"
              dataKey="pressure_weather"
              stroke={data.sensor_colors?.pressure_weather_color}
              name="Vapor Pressure Deficit (kPa)"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default VaporPressureDeficitGraph;
