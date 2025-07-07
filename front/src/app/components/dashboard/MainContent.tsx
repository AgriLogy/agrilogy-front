// import React, { useEffect, useState } from "react";
// import "./MainContent.css";
// import { Box, Text } from "@chakra-ui/react";
// import Zones from "./Zones";
// import SensorDataTable from "../SensorDataTable";
// import SensorDataChart from "../SensorDataChart";
// import StatusIndicators from "./StatusIndicators"; // Import the new component
// import useColorModeStyles from "@/app/utils/useColorModeStyles";
// import { SensorData } from "@/app/data/dashboard/data";
// import GoogleMapWeather from "../GoogleMapWeather";
// // import axiosInstance from "@/app/lib/axiosInstance";
// import axiosInstance from "@/app/lib/api";
// import EmptyBox from "../common/EmptyBox";

// const MainContent = () => {
//   const { bg, textColor } = useColorModeStyles();
//   const [sensorData, setSensorData] = useState<SensorData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axiosInstance.get("/api/all-sensor-data/");
//         console.log("API Response:", response.data); // Log the API response to inspect its structure

//         // If response.data has a key "sensor_data" containing the array:
//         const data: SensorData[] = response.data.sensor_data || []; // Fallback to empty array if sensor_data is missing
//         setSensorData(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Unknown error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <EmptyBox/>;

//   if (error ) {
//     if (error === "Network Error")
//         window.location.href = "/login";
//     return <Text color="red.500">Error: {error}</Text>;
//   }

//   return (
//     <div className="container">
//       <Box bg={bg} className="header">
//         <Text color={textColor}>Dashboard</Text>
//       </Box>
//       <Box bg={bg} className="box">
//         <Zones />
//       </Box>
//       <Box bg={bg} className="box">
//         <StatusIndicators
//           humidity={sensorData[0]?.humidity_weather}
//           solarRadiation={sensorData[0]?.solar_radiation}
//           solarPanelVoltage={sensorData[0]?.solar_radiation}
//         />
//       </Box>
//       <Box bg={bg} className="box">
//         <SensorDataTable data={sensorData} />
//       </Box>
//       <Box bg={bg} className="box">
//         <SensorDataChart data={sensorData} />
//       </Box>
//       <Box bg={bg} className="box wide">
//         <GoogleMapWeather />
//       </Box>
//     </div>
//   );
// };

// export { MainContent };

"use client";

import {
  Box,
  Heading,
  SimpleGrid,
  Button,
  useDisclosure,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { SensorData } from "@/app/types";
import PhSoilLastData from "../analytics/SoilPh/PhSoilLastData";
import FormModalCreate from "../alert/FormModalCreate";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import GoogleMapWeather from "../GoogleMapWeather";

// Simulated sensor groups (you can load these from the backend)
const SENSOR_CATEGORIES = [
  {
    title: "🌱 Sol",
    sensors: [
      "soil irrigation status",
      "soil moisture status",
      "soil ph status",
      "soil temperature status",
      "soil conductivity status",
    ],
  },
  {
    title: "☁️ Météo",
    sensors: [
      "et0 status",
      "wind speed status",
      "wind direction status",
      "solar radiation status",
      "temperature humidity weather status",
      "precipitation humidity rate status",
      "pluviometry status",
      "data table status",
      "wind radar status",
      "cumulative precipitation status",
      "precipitation rate status",
      "weather temperature humidity status",
    ],
  },
  {
    title: "💧 Eau",
    sensors: [
      "water flow status",
      "water pressure status",
      "water ph status",
      "water ec status",
    ],
  },
  {
    title: "🌿 Plante",
    sensors: [
      "leaf sensor status",
      "fruit size status",
      "large fruit diameter status",
    ],
  },
  {
    title: "🌾 Engrais/Nutriments",
    sensors: ["npk status"],
  },
  {
    title: "⚡ Autres",
    sensors: ["electricity consumption status"],
  },
];

export default function Dashboard() {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { bg } = useColorModeStyles();

  const openAlertModal = (sensor: string) => {
    setSelectedSensor(sensor);
    onOpen();
  };

  const dummySensorData: SensorData[] = [
    {
      value: 6.5,
      default_unit: "pH",
      timestamp: new Date().toISOString(),
      id: 1,
      color: "#000000",
      courbe_name: "lala",
      available_units: ["kg/j"],
    },
  ];

  return (
    <Box p={6}>
      <div className="container">
        <Box bg={bg} className="header">
          <Heading mb={6}>Tableau de bord des capteurs</Heading>
        </Box>
      </div>
      {SENSOR_CATEGORIES.map((category) => (
        <Box key={category.title} mb={10}>
          <Heading size="md" mb={4}>
            {category.title}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {category.sensors.map((sensor) => (
              <Box
                key={sensor}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                bg="gray.50"
              >
                <VStack spacing={4}>
                  <Text fontWeight="bold">{sensor}</Text>
                  {/* Replace this with a dynamic component for each sensor */}
                  <PhSoilLastData data={dummySensorData} />
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => openAlertModal(sensor)}
                  >
                    Créer une alerte
                  </Button>
                  //{" "}
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      ))}
      <Box bg={bg} height="500px" className="box wide">
        <GoogleMapWeather />
      </Box>
      {selectedSensor && (
        <FormModalCreate
          isOpen={isOpen}
          onClose={onClose}
          refreshAlerts={async () => {}}
        />
      )}
    </Box>
  );
}
