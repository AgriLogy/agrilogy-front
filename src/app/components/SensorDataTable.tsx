import React from 'react';
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
} from '@chakra-ui/react';
import useColorModeStyles from '../utils/useColorModeStyles';
import { formatNumber } from '../utils/formatNumber';
import { SensorData } from '../data/dashboard/data';
import EmptyBox from './common/EmptyBox';

const n = (v: number | undefined | null, decimals = 2) =>
  v == null || Number.isNaN(Number(v)) ? '—' : formatNumber(Number(v), decimals);

interface SensorDataTableProps {
  data: SensorData[];
}

const SensorDataTable: React.FC<SensorDataTableProps> = ({ data }) => {
  const { bg, textColor, navBgColor } = useColorModeStyles();
  const fontSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const p = useBreakpointValue({ base: 2, md: 4 });

  // Get the last 8 records
  const lastRecords = Array.isArray(data) && data.length > 0 ? data : []; // Ensure it's an array, and not empty

  if (lastRecords.length === 0) {
    return <EmptyBox />;
  }

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
              <Th fontSize={fontSize}>Temp. Air (°C)</Th>
              <Th fontSize={fontSize}>Humidity Weather (%)</Th>
              <Th fontSize={fontSize}>Solar Radiation (W/m²)</Th>
              <Th fontSize={fontSize}>Wind Speed (m/s)</Th>
              <Th fontSize={fontSize}>Precipitation Rate (mm/h)</Th>
              <Th fontSize={fontSize}>Soil EC Medium (dS/m)</Th>
              <Th fontSize={fontSize}>Soil Moisture Medium (%)</Th>
              <Th fontSize={fontSize}>Soil Temperature Medium (°C)</Th>
              <Th fontSize={fontSize}>Soil pH</Th>
              <Th fontSize={fontSize}>Wind Direction (°)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {lastRecords.map((entry, index) => (
              <Tr key={index}>
                <Td fontSize={fontSize} color={textColor}>
                  {entry.timestamp}
                </Td>
                <Td fontSize={fontSize} color={textColor}>
                  {n(entry.temperature_weather)}°C
                </Td>
                <Td fontSize={fontSize} color={textColor}>
                  {n(entry.humidity_weather)}%
                </Td>
                <Td fontSize={fontSize} color={textColor}>
                  {n(entry.solar_radiation)} W/m²
                </Td>
                <Td fontSize={fontSize} color={textColor}>
                  {n(entry.wind_speed)} m/s
                </Td>
                <Td fontSize={fontSize} color={textColor}>
                  {n(entry.precipitation_rate)} mm/h
                </Td>
                <Td fontSize={fontSize} color={textColor}>
                  {n(entry.ec_soil_medium)} dS/m
                </Td>
                <Td fontSize={fontSize} color={textColor}>
                  {n(entry.soil_moisture_medium)}%
                </Td>
                <Td fontSize={fontSize} color={textColor}>
                  {n(entry.soil_temperature_medium)}°C
                </Td>
                <Td fontSize={fontSize} color={textColor}>
                  {n(entry.ph_soil)}
                </Td>
                <Td fontSize={fontSize} color={textColor}>
                  {n(entry.wind_direction, 0)}°
                </Td>
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
