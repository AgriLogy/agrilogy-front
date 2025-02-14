"use client";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import { Box, Spinner, Text } from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomLegend = (props: any) => {
  return (
    <ul
      style={{
        display: "flex",
        listStyle: "none",
        padding: 0,
        flexWrap: "wrap",
        margin: 0,
        marginLeft: 60,
      }}
    >
      {props.payload.map((entry: any, index: number) => (
        <li
          key={`item-${index}`}
          style={{
            marginRight: "15px",
            fontSize: "12px",
            color: entry.color,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              marginRight: "5px",
              backgroundColor: entry.color,
              width: "10px",
              height: "10px",
              display: "inline-block",
            }}
          />
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

const IrrigationGraph = ({ data }: { data: any }) => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility
  const chartColor = "rgba(75,192,192,1)";

  if (!data) return <Spinner/>;


  return (
    <Box
      width="100%"
      height="100%"
      bg={bg}
      borderRadius="md"
      boxShadow="lg"
      p={2}
      overflow="hidden"
    >
      <Text color={textColor} fontSize="lg" fontWeight="bold" mb={4}>
        {data.sensor_names?.soil_irrigation}
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.sensor_data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="soil_moisture_low"
            stroke={data.sensor_colors?.soil_moisture_low_color}
            name="Humidité 20 cm (%)"
          />
          <Line
            type="monotone"
            dataKey="soil_moisture_medium"
            stroke={data.sensor_colors?.soil_moisture_medium_color}
            name="Humidité 40 cm (%)"
          />
          <Line
            type="monotone"
            dataKey="soil_moisture_high"
            stroke={data.sensor_colors?.soil_moisture_high_color}
            name="Humidité 60 cm (%)"
          />
          {/* <Line type="monotone" dataKey="irrigation" troke={data.sensor_colors.irrigation_color} name="Irrigation (L)" /> */}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default IrrigationGraph;
