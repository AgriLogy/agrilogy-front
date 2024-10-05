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
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import { SensorData } from "../data/dashboard/data";
import useColorModeStyles from "../utils/useColorModeStyles"; // Import your utility

interface SensorDataTableProps {
  data: SensorData[];
}

const SensorDataTable: React.FC<SensorDataTableProps> = ({ data }) => {
  const { bg, textColor, hoverColor, bgColor, navBgColor } = useColorModeStyles(); // Use your utility
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const p = useBreakpointValue({ base: 2, md: 4 });

  return (
    <Box
      width="100%"
      height="100%"
      bg={bg}
      borderRadius="md"
      boxShadow="lg"
      p={p}
      overflowX="auto"
    >
      <Text color={textColor} fontSize="lg" fontWeight="bold" mb={4}>
        Sensor Data Table
      </Text>
      <div className="table-container">
        <Table variant="striped" size="sm" width="100%">
          <Thead>
            <Tr color={navBgColor}>
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
                <Td fontSize={fontSize} className="fixed-column" color={textColor}>
                  {entry.formatted_timestamp}
                </Td>
                <Td fontSize={fontSize} color={textColor}>{entry.hc_air_temperature}°C</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.wetbulb_temperature}°C</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.solar_radiation} W/m²</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.vpd}</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.hc_relative_humidity}%</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.precipitation} mm</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.leaf_wetness}</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.wind_speed} m/s</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.solar_panel} V</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.battery_voltage} V</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.delta_t}</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.sunshine_duration} min</Td>
                <Td fontSize={fontSize} color={textColor}>{entry.et0?.toFixed(2)} mm/day</Td>
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
          background: ${bg}; /* Ensures the background matches the table */
          z-index: 1;
        }

        thead {
          position: sticky;
          top: 0;
          background: ${navBgColor}; /* Ensures the header matches the table background */
          z-index: 2;
        }
      `}</style>
    </Box>
  );
};

export default SensorDataTable;
