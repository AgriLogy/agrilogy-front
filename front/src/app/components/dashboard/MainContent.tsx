import React, { useEffect, useState } from "react";
import "./MainContent.css";
import { Box, Text } from "@chakra-ui/react";
import Zones from "./Zones";
import SensorDataTable from "../SensorDataTable";
import SensorDataChart from "../SensorDataChart";
import StatusIndicators from "./StatusIndicators"; // Import the new component
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import { SensorData } from "@/app/data/dashboard/data";
import GoogleMapWeather from "../GoogleMapWeather";
import LoadingSpinner from "../common/LoadingSpinner";
// import axiosInstance from "@/app/lib/axiosInstance";
import axiosInstance from "@/app/lib/axiosInstance";

const MainContent = () => {
  const { bg, textColor } = useColorModeStyles();
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/all-sensor-data/");
        console.log("API Response:", response.data); // Log the API response to inspect its structure

        // If response.data has a key "sensor_data" containing the array:
        const data: SensorData[] = response.data.sensor_data || []; // Fallback to empty array if sensor_data is missing
        setSensorData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Text color="red.500">Error: {error}</Text>;
  }

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Dashboard</Text>
      </Box>
      <Box bg={bg} className="box">
        <Zones />
      </Box>
      <Box bg={bg} className="box">
        <StatusIndicators
          humidity={sensorData[0]?.humidity_weather}
          solarRadiation={sensorData[0]?.solar_radiation}
          solarPanelVoltage={sensorData[0]?.solar_radiation}
        />
      </Box>
      <Box bg={bg} className="box">
        <SensorDataTable data={sensorData} />
      </Box>
      <Box bg={bg} className="box">
        <SensorDataChart data={sensorData} />
      </Box>
      <Box bg={bg} className="box wide">
        <GoogleMapWeather />
      </Box>
    </div>
  );
};

export { MainContent };
