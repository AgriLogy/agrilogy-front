import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import useColorModeStyles from "../utils/useColorModeStyles";
import { SensorData } from "../data/dashboard/data";

interface SensorDataTableProps {
  data: SensorData[];
}

const SensorDataTable: React.FC<SensorDataTableProps> = ({ data }) => {
  const { bg, textColor, navBgColor } = useColorModeStyles();
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const p = useBreakpointValue({ base: 2, md: 4 });

  // Get the last 8 records
  const lastRecords = data.slice(-8);

  return (
    <Box
      width="100%"
      height="100%"
      bg={bg}
      borderRadius="md"
      boxShadow="lg"
      p={p}
      overflowX="auto" // Ensure horizontal scroll is supported
    >
      <Text color={textColor} fontSize="lg" fontWeight="bold" mb={4}>
        Table des données des capteurs
      </Text>
      <div className="table-container">
        <Table variant="striped" size="sm" width="100%">
          <Thead>
            <Tr color={navBgColor}>
              <Th fontSize={fontSize}>Timestamp</Th>
              <Th fontSize={fontSize}>Temp. Air HC (°C)</Th>
              <Th fontSize={fontSize}>Temp. Humide (°C)</Th>
              <Th fontSize={fontSize}>Rayonnement Solaire (W/m²)</Th>
              <Th fontSize={fontSize}>VPD</Th>
              <Th fontSize={fontSize}>Humidité Rel. HC (%)</Th>
              <Th fontSize={fontSize}>Précipitation (mm)</Th>
              <Th fontSize={fontSize}>Humidité Foliaire</Th>
              <Th fontSize={fontSize}>Vitesse Vent (m/s)</Th>
              <Th fontSize={fontSize}>Tension Panneau (V)</Th>
              <Th fontSize={fontSize}>Tension Batterie (V)</Th>
              <Th fontSize={fontSize}>Delta T</Th>
              <Th fontSize={fontSize}>Durée ensoleillement (min)</Th>
              <Th fontSize={fontSize}>ET0 (mm/jour)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {lastRecords.map((entry, index) => (
              <Tr key={index}>
                <Td fontSize={fontSize} color={textColor}>{entry.formatted_timestamp}</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.hc_air_temperature}°C</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.wetbulb_temperature}°C</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.solar_radiation} W/m²</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.vpd}</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.relative_humidity}%</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.precipitation} mm</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.leaf_wetness}</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.wind_speed} m/s</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.solar_panel} V</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.battery_voltage} V</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.delta_t}</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.sunshine_duration} min</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.et0?.toFixed(2)} mm/jour</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <style jsx>{`
        .table-container {
          max-height: 400px; // Limit height for vertical scrolling if needed
          overflow-y: auto;
          position: relative;
          overflow-x: auto; // Enable horizontal scrolling
        }
      `}</style>
    </Box>
  );
};

export default SensorDataTable;
