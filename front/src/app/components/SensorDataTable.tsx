"use client";
import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Text,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { SensorData } from "../data/dashboard/data";

interface SensorDataTableProps {
  data: SensorData[];
}

const SensorDataTable: React.FC<SensorDataTableProps> = ({ data }) => {
  const { colorMode } = useColorMode();
  const tableBg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("gray.700", "gray.200");
  const headertext = useColorModeValue("gray.100", "gray.800");
  const fontColor = useColorModeValue("gray.700", "gray.200");
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const p = useBreakpointValue({ base: 2, md: 4 });

  return (
    <Box
      width="100%"
      height="100%"
      bg={tableBg}
      borderRadius="md"
      boxShadow="lg"
      p={p}
      overflowX="auto"
    >
      <Text color={fontColor} fontSize="lg" fontWeight="bold" mb={4}>
        Sensor Data Table
      </Text>
      <div className="table-container">
        <Table variant="striped" size="sm" width="100%">
          <Thead>
            <Tr  color={headertext}>
              <Th fontSize={fontSize} whiteSpace="nowrap">Timestamp</Th>
              <Th fontSize={fontSize} whiteSpace="nowrap">HC Air Temperature (°C)</Th>
              <Th fontSize={fontSize} whiteSpace="nowrap">Wetbulb Temperature (°C)</Th>
              <Th fontSize={fontSize} whiteSpace="nowrap">Solar Radiation (W/m²)</Th>
              <Th fontSize={fontSize} whiteSpace="nowrap">VPD</Th>
              <Th fontSize={fontSize} whiteSpace="nowrap">HC Relative Humidity (%)</Th>
              <Th fontSize={fontSize} whiteSpace="nowrap">Precipitation (mm)</Th>
              <Th fontSize={fontSize} whiteSpace="nowrap">Leaf Wetness</Th>
              <Th fontSize={fontSize} whiteSpace="nowrap">Wind Speed (m/s)</Th>
              <Th fontSize={fontSize} whiteSpace="nowrap">Solar Panel (V)</Th>
              <Th fontSize={fontSize} whiteSpace="nowrap">Battery Voltage (V)</Th>
              <Th fontSize={fontSize} whiteSpace="nowrap">Delta T</Th>
              <Th fontSize={fontSize} whiteSpace="nowrap">Sunshine Duration (min)</Th>
              <Th fontSize={fontSize} whiteSpace="nowrap">ET0 (mm/day)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((entry, index) => (
              <Tr key={index}>
                <Td fontSize={fontSize} className="fixed-column" color={fontColor}>
                  {entry.timestamp}
                </Td>
                <Td fontSize={fontSize} color={fontColor}>{entry.hc_air_temperature}°C</Td>
                <Td fontSize={fontSize} color={fontColor}>{entry.wetbulb_temperature}°C</Td>
                <Td fontSize={fontSize} color={fontColor}>{entry.solar_radiation} W/m²</Td>
                <Td fontSize={fontSize} color={fontColor}>{entry.vpd}</Td>
                <Td fontSize={fontSize} color={fontColor}>{entry.hc_relative_humidity}%</Td>
                <Td fontSize={fontSize} color={fontColor}>{entry.precipitation} mm</Td>
                <Td fontSize={fontSize} color={fontColor}>{entry.leaf_wetness}</Td>
                <Td fontSize={fontSize} color={fontColor}>{entry.wind_speed} m/s</Td>
                <Td fontSize={fontSize} color={fontColor}>{entry.solar_panel} V</Td>
                <Td fontSize={fontSize} color={fontColor}>{entry.battery_voltage} V</Td>
                <Td fontSize={fontSize} color={fontColor}>{entry.delta_t}</Td>
                <Td fontSize={fontSize} color={fontColor}>{entry.sunshine_duration} min</Td>
                <Td fontSize={fontSize} color={fontColor}>{entry.et0?.toFixed(2)} mm/day</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <style jsx>{`
        .table-container {
          max-height: 400px; /* Set a max height for the container */
          overflow-y: auto;  /* Enable vertical scrolling */
          position: relative;
          overflow-x: auto;  /* Enable horizontal scrolling */
        }

        .fixed-column {
          position: sticky;
          left: 0;
          background: ${tableBg}; /* Ensures the background matches the table */
          z-index: 1;
        }

        thead {
          position: sticky;
          top: 0;
          background: ${headerBg}; /* Ensures the header matches the table background */
          z-index: 2;
        }
      `}</style>
    </Box>
  );
};

export default SensorDataTable;
