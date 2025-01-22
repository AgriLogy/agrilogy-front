"use client";
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { Box, Text } from '@chakra-ui/react'; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; 

const CustomLegend = (props: any) => {
  return (
    <ul style={{ display: "flex", listStyle: "none", padding: 0, flexWrap: "wrap", margin: 0, marginLeft: 60 }}>
      {props.payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} style={{ marginRight: "15px", fontSize: "12px", color: entry.color, whiteSpace: "nowrap" }}>
          <span style={{ marginRight: "5px", backgroundColor: entry.color, width: "10px", height: "10px", display: "inline-block" }} />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

const CustomTick = ({ x, y, payload }: any) => {
  return (
    <text x={x} y={y} textAnchor="middle" fill="#666" fontSize="10">
      {payload.value}
    </text>
  );
};

const IrrigationGraph = ({ sensorData }: { sensorData: any }) => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility
  const chartColor = "rgba(75,192,192,1)";

  if (!sensorData) return <div>Loading...</div>; // Ensure sensorData is loaded

  return (
    <Box width="100%" height="100%" bg={bg} borderRadius="md" boxShadow="lg" p={2} overflow="hidden">
      <Text color={textColor} fontSize="lg" fontWeight="bold" mb={4}>
        Graphique d'Irrigation
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sensorData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip />
          <Legend content={<CustomLegend />} />
          <Line type="monotone" dataKey="soil_moisture_low" stroke={chartColor} name="Humidité 20 cm (%)" />
          <Line type="monotone" dataKey="soil_moisture_medium" stroke="rgba(255,99,132,1)" name="Humidité 40 cm (%)" />
          <Line type="monotone" dataKey="soil_moisture_high" stroke="rgba(255,206,86,1)" name="Humidité 60 cm (%)" />
          {/* <Line type="monotone" dataKey="irrigation" stroke="rgba(153,102,255,1)" name="Irrigation (L)" /> */}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default IrrigationGraph;
