'use client';
import { Box, Spinner, Text } from '@chakra-ui/react';
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
import useColorModeStyles from '@/app/utils/useColorModeStyles'; // Import the utility

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

const CustomTick = ({ x, y, payload }: any) => (
  <text x={x} y={y} textAnchor="middle" fill="#666" fontSize="10">
    {payload.value}
  </text>
);

const WindDirectionGraph = ({ data }: { data: any }) => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility for styles
  if (!data) return <Spinner />;

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
        {data.sensor_names?.wind_direction}
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.sensor_data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={<CustomTick />}
          
          stroke="#666"                    // Axis line color
          strokeWidth={1}                  // Axis line thickness
          // tick={{                          // Tick styling
          //   fill: '#666',                  // Tick label color
          //   fontSize: 17,                  // Tick label font size
          //   fontFamily: 'Arial, sans-serif' // Tick label font
          // }}
          axisLine={{                       // Main axis line styling
            stroke: '#666',
            strokeWidth: 1
          }}
          tickLine={{                       // Tick line styling
            stroke: '#666',
            strokeWidth: 1
                        }}/>
          <YAxis tick={<CustomTick />} domain={[0, 360]} 
          
          
          stroke="#666"                    // Axis line color
          strokeWidth={1}                  // Axis line thickness
          // tick={{                          // Tick styling
          //   fill: '#666',                  // Tick label color
          //   fontSize: 17,                  // Tick label font size
          //   fontFamily: 'Arial, sans-serif' // Tick label font
          // }}
          axisLine={{                       // Main axis line styling
            stroke: '#666',
            strokeWidth: 1
          }}
          tickLine={{                       // Tick line styling
            stroke: '#666',
            strokeWidth: 1
                        }}/>
          <Tooltip />
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
            name="Wind Direction (°)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default WindDirectionGraph;
