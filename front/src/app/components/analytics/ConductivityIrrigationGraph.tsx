"use client";

import { useEffect, useState } from "react";
import { Box, Text, useColorMode } from "@chakra-ui/react";
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
import axiosInstance from "@/app/lib/axiosInstance";

interface ConductivityData {
	timestamp: string;
	conductivity: number;
	irrigation: number;
  }

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

const ConductivityIrrigationGraph = () => {
  const [chartData, setChartData] = useState<ConductivityData[]>([]);
  const { colorMode } = useColorMode();
  const chartBg = colorMode === "light" ? "white" : "gray.800";

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<ConductivityData[]>('api/conductivitydata/');
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching temperature data:', error);
      }
    };

    fetchData();
  }, []);

  if (chartData.length === 0) return <div>Loading...</div>;

  return (
    <Box
      width="100%"
      height="100%"
      bg={chartBg}
      borderRadius="md"
      boxShadow="lg"
      p={2}
      ml={0}
      overflow="hidden"
    >
      <Text
        color={colorMode === "light" ? "gray.700" : "gray.200"}
        fontSize="lg"
        fontWeight="bold"
        mb={4}
      >
        Graphique de Conductivité
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="conductivity"
            stroke="rgba(75,192,192,1)"
            name="Conductivité (mS/cm)"
          />
          <Line
            type="monotone"
            dataKey="irrigation"
            stroke="rgba(153,102,255,1)"
            name="Irrigation (L)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ConductivityIrrigationGraph;
