// components/CumulIrrigationGraph.tsx
"use client";

import { useEffect, useState } from 'react';
import { Box, Text, useColorMode } from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axiosInstance from '@/app/lib/axiosInstance';
// import { CumulData, cumulData } from '@/app/data/analytics/cumul';

export interface CumulData {
	timestamp: string;
	cumul: number;
  }
  

const CustomLegend = (props: any) => {
	return (
	  <ul
		style={{
		  display: "flex",
		  listStyle: "none",
		  padding: 0,
		  flexWrap: "wrap",  // Allow wrapping of items
		  margin: 0,
		  marginLeft: 60,         // Remove default margin
		}}
	  >
		{props.payload.map((entry: any, index: number) => (
		  <li
			key={`item-${index}`}
			style={{
			  marginRight: "15px",
			  fontSize: "12px",
			  color: entry.color,
			  whiteSpace: "nowrap", // Prevent text wrapping within each item
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


const CumulIrrigationGraph = () => {
  const [chartData, setChartData] = useState<CumulData[]>([]);
  const { colorMode } = useColorMode();
  const chartBg = colorMode === "light" ? "white" : "gray.800";

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<CumulData[]>('api/cumuldata/');
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching temperature data:', error);
      }
    };

    fetchData();
  }, []);

  if (!chartData.length) return <div>Loading...</div>;

  return (
    <Box width="100%" height="100%" bg={chartBg} borderRadius="md" boxShadow="lg" p={2}>
      <Text color={colorMode === "light" ? "gray.700" : "gray.200"} fontSize="lg" fontWeight="bold" mb={4}>
        Cumul d'Irrigation
      </Text>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={<CustomTick />} />
          <YAxis tick={<CustomTick />} />
          <Tooltip />
          <Legend content={<CustomLegend />} />

          <Bar dataKey="cumul" fill="rgba(75,192,192,1)" name="Cumul (L)" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CumulIrrigationGraph;
