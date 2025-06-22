import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";

interface Et0Data {
  timestamp: string;
  value: number;
  default_unit: string;
}

const EC0Chart = ({
  weatherData,
  calculatedData,
  loading,
}: {
  weatherData: Et0Data[];
  calculatedData: Et0Data[];
  loading: boolean;
}) => {
  const chartData = weatherData.map((item, index) => {
    const calculated = calculatedData[index]?.value ?? null;
    return {
      name: item.timestamp,
      Weather: item.value,
      Calculated: calculated,
    };
  });

  const textColor = useColorModeValue("gray.800", "gray.200");

  return (
    <Box width="100%" pr={4} pb={4}>
      <Text fontSize="xl" fontWeight="bold" color={textColor} mb={4}>
        ET0 Comparaison (Capteur vs Calculé)
      </Text>

      {loading ? (
        <Text>Chargement...</Text>
      ) : chartData.length === 0 ? (
        <Text>Aucune donnée disponible</Text>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Weather" fill="#3182ce" name="ET0 Capteur" />
            <Bar dataKey="Calculated" fill="#e53e3e" name="ET0 Calculé" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default EC0Chart; 
