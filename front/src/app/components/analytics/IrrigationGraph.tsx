"use client";
import { Box, Text, useColorMode } from '@chakra-ui/react'; 
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

// Updated IrrigationGraph component to accept sensorData as a prop
const IrrigationGraph = ({ sensorData }: { sensorData: any }) => {
  const { colorMode } = useColorMode();
  const chartBg = colorMode === "light" ? "white" : "gray.800";
  const chartColor = "rgba(75,192,192,1)";

  if (!sensorData) return <div>Loading...</div>; // Ensure sensorData is loaded

  return (
    <Box width="100%" height="100%" bg={chartBg} borderRadius="md" boxShadow="lg" p={2} ml={0} overflow="hidden">
      <Text color={colorMode === "light" ? "gray.800" : "gray.200"} fontSize="lg" fontWeight="bold" mb={4}>
        Graphique d'Irrigation
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sensorData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip />
          <Legend content={<CustomLegend />} />
          <Line type="monotone" dataKey="humidity_20" stroke={chartColor} name="Humidité 20 cm (%)" />
          <Line type="monotone" dataKey="humidity_40" stroke="rgba(255,99,132,1)" name="Humidité 40 cm (%)" />
          <Line type="monotone" dataKey="humidity_60" stroke="rgba(255,206,86,1)" name="Humidité 60 cm (%)" />
          <Line type="monotone" dataKey="irrigation" stroke="rgba(153,102,255,1)" name="Irrigation (L)" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default IrrigationGraph;
