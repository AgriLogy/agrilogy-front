// src/app/components/MainContent.tsx

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

export const MainContent: React.FC = () => {
  const { bg, textColor } = useColorModeStyles(); 
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/dashboard_sensor_data/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: SensorData[] = await response.json(); 
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
    return <LoadingSpinner/>;
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
  humidity={sensorData[0]?.relative_humidity} 
  solarRadiation={sensorData[0]?.solar_radiation}
  solarPanelVoltage={sensorData[0]?.solar_panel_voltage}
  // relativeHumidity={sensorData[0]?.relative_humidity} 
/>

      </Box>
      <Box bg={bg} className="box">
        <SensorDataTable data={sensorData} />
      </Box>
      <Box bg={bg} className="box">
        <SensorDataChart data={sensorData} />
      </Box>
      <Box bg={bg} className="box wide">
        <GoogleMapWeather/>
      </Box>
    </div>
  );
};
