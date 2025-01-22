"use client";
import React from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorMode,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { CSVLink } from "react-csv";
import useColorModeStyles from "@/app/utils/useColorModeStyles";

interface WeatherData {
  timestamp: string;
  et0: number;
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  cumulative_rainfall: number;
  solar_radiation: number;
  vapor_pressure_deficit: number;
  precipitation: number;
}

interface DataTableProps {
  data: WeatherData[] | null; // Changed to allow null for loading state
  // loading: boolean; // Added loading prop
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility
  const { colorMode } = useColorMode();

  // CSV headers
  const headers = [
    { label: "Timestamp", key: "timestamp" },
    { label: "ET0 (mm)", key: "et0" },
    { label: "Temperature (°C)", key: "temperature" },
    { label: "Humidity (%)", key: "humidity" },
    { label: "Wind Speed (m/s)", key: "wind_speed" },
    { label: "Wind Direction (°)", key: "wind_direction" },
    { label: "Cumulative Rainfall (mm)", key: "cumulative_rainfall" },
    { label: "Solar Radiation (W/m²)", key: "solar_radiation" },
    { label: "Vapor Pressure Deficit (kPa)", key: "vapor_pressure_deficit" },
    { label: "Precipitation (mm)", key: "precipitation" },
  ];

  if (!data || data.length === 0) {
    return (
      <Box
        width="100%"
        p={4}
        bg={colorMode === "light" ? "white" : "gray.800"}
        borderRadius="md"
        boxShadow="lg"
      >
        <Text
          fontSize="lg"
          fontWeight="bold"
          mb={4}
          color={colorMode === "light" ? "gray.700" : "gray.200"}
        >
          No Data Available
        </Text>
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      p={4}
      bg={colorMode === "light" ? "white" : "gray.800"}
      borderRadius="md"
      boxShadow="lg"
    >
      <HStack justify="space-between">
        <Text
          fontSize="lg"
          fontWeight="bold"
          mb={4}
          color={colorMode === "light" ? "gray.700" : "gray.200"}
        >
          Weather Data
        </Text>
        <CSVLink
          data={data}
          headers={headers}
          filename="weather_data.csv"
          style={{ textDecoration: "none" }}
        >
          <Button colorScheme="teal" mb={4}>
            Download CSV
          </Button>
        </CSVLink>
      </HStack>
      <Box overflowX="auto" overflowY="auto" maxHeight="400px">
        <Table variant="simple" whiteSpace="nowrap">
          <Thead>
            <Tr
              position="sticky"
              top="0"
              bg={colorMode === "light" ? "white" : "gray.800"}
              zIndex={1}
            >
              <Th
                position="sticky"
                left="0"
                bg={colorMode === "light" ? "white" : "gray.800"}
                zIndex={1}
              >
                Timestamp
              </Th>
              {headers.slice(1).map((header) => (
                <Th key={header.key}>{header.label}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, index) => (
              <Tr key={index}>
                <Td
                  color={textColor}
                  position="sticky"
                  left="0"
                  bg={colorMode === "light" ? "white" : "gray.800"}
                  zIndex={0}
                >
                  {row.timestamp}
                </Td>
                <Td color={textColor}>{row.et0}</Td>
                <Td color={textColor}>{row.temperature}</Td>
                <Td color={textColor}>{row.humidity}</Td>
                <Td color={textColor}>{row.wind_speed}</Td>
                <Td color={textColor}>{row.wind_direction}</Td>
                <Td color={textColor}>{row.cumulative_rainfall}</Td>
                <Td color={textColor}>{row.solar_radiation}</Td>
                <Td color={textColor}>{row.vapor_pressure_deficit}</Td>
                <Td color={textColor}>{row.precipitation}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default DataTable;
