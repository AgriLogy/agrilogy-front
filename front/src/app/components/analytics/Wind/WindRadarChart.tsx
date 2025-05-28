import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";

interface WindData {
  timestamp: string;
  value: number;
  default_unit: string;
}

const WindRadarChart = ({
  windSpeedData,
  windDirectionData,
  loading,
}: {
  windSpeedData: WindData[];
  windDirectionData: WindData[];
  loading: boolean;
}) => {
  const chartData = windSpeedData.map((item, index) => {
    const direction = windDirectionData[index]?.value ?? 0;
    return {
      name: item.timestamp,
      speed: item.value,
      direction,
    };
  });

  const textColor = useColorModeValue("gray.800", "gray.200");

  return (
    <Box width="100%" pr={4} pb={4} height="300px">
      <Text fontSize="xl" fontWeight="bold" color={textColor} mb={4}>
        Radar du vent (vitesse & direction)
      </Text>

      {loading ? (
        <Text>Chargement...</Text>
      ) : chartData.length === 0 ? (
        <Text>Aucune donnée disponible</Text>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, Math.max(...chartData.map((d) => d.speed)) || 1]} />
            <Tooltip />
            <Radar
              name="Vitesse du vent"
              dataKey="speed"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default WindRadarChart;
