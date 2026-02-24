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

const TempHumidityGraph = ({ data }: { data: any }) => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility
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
        {data.sensor_names?.temperature_humidity_weather}
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
          <YAxis tick={<CustomTick />} 
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
          {/* Line for Temperature */}
          <Line
            type="monotone"
            dataKey="temperature_weather"
            stroke={data.sensor_colors?.temperature_weather_color}
            name="Temperature (°C)"
          />
          {/* Line for Humidity */}
          <Line
            type="monotone"
            dataKey="humidity_weather"
            stroke={data.sensor_colors?.humidity_weather_color}
            name="Humidity (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TempHumidityGraph;
