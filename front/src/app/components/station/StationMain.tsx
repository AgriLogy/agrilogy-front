"use client";
import React, { useEffect, useState } from "react";
import "./StationMain.css";
import { Box, Text } from "@chakra-ui/react";
import axiosInstance from "@/app/lib/api";

import useColorModeStyles from "@/app/utils/useColorModeStyles";
import LoadingSpinner from "../common/LoadingSpinner";
import DateRangePicker from "../analytics/DateRangePicker";
import Et0Graph from "./Et0Graph";
import TempHumidityGraph from "./TempHumidityGraph";
import WindSpeedGraph from "./WindSpeedGraph";
import WindDirectionGraph from "./WindDirectionGraph";
import PluvometricGraph from "./PluvometricGraph";
import SolarRadiationGraph from "./SolarRadiationGraph";
import VaporPressureDeficitGraph from "./VaporPressureDeficitGraph";
import PrecipitationHumidityGraph from "./PrecipitationHumidityGraph";
import DataTable from "./DataTable";
import { SensorData } from "@/app/data/dashboard/data";

const StationMain: React.FC = () => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility
  const [data, setData] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          start_date: startDate,
          end_date: endDate,
        };
        const response = await axiosInstance.get("/api/all-sensor-data/", {
          params,
        });
        console.log("API Response:", response.data); // Log the API response to inspect its structure

        // Assuming response.data.sensor_data contains an array of SensorData
        const sensorData: SensorData[] = response.data.sensor_data || [];
        setData(sensorData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    fetchData();
  }, [startDate, endDate]);

  // if (!data) return <LoadingSpinner/>;

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Données du station météo</Text>
      </Box>
      <Box bg={bg} className="header" mt={0} mb={0}>
        <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
      </Box>
      <Box bg={bg} className="box wide">
        <Et0Graph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <TempHumidityGraph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <WindSpeedGraph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <WindDirectionGraph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <PluvometricGraph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <SolarRadiationGraph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <VaporPressureDeficitGraph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <PrecipitationHumidityGraph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <DataTable data={data} />
      </Box>
    </div>
  );
};

export default StationMain;
