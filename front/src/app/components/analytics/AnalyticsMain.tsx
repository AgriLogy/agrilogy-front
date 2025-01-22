"use client";
import React, { useEffect, useState } from "react";
import "./AnalyticsMain.css";
import { Box, Text } from "@chakra-ui/react";
import IrrigationGraph from "./IrrigationGraph";
import PhGraph from "./PhGraph";
import DateRangePicker from "./DateRangePicker";
import ConductivityIrrigationGraph from "./ConductivityIrrigationGraph";
import CumulIrrigationGraph from "./CumulIrrigationGraph";
import TemperatureGraph from "./TemperatureGraph";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import LoadingSpinner from "../common/LoadingSpinner";
import useAxiosInstance from "@/app/lib/axiosInstance";
import { SensorData } from "@/app/data/dashboard/data";

const AnalyticsMain: React.FC = () => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility
  const [data, setData] = useState<SensorData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/all-sensor-data/");
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

  if (error) return <LoadingSpinner />;

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Données sur le sol</Text>
      </Box>

      <Box bg={bg} className="header" mt={0} mb={0}>
        <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
      </Box>

      <Box bg={bg} className="box wide">
        <IrrigationGraph sensorData={data} />
      </Box>

      <Box bg={bg} className="box wide">
        <PhGraph data={data} />
      </Box>

      <Box bg={bg} className="box wide">
        <ConductivityIrrigationGraph data={data} />
      </Box>

      {/* <Box bg={bg} className="box wide">
        <CumulIrrigationGraph data={data} />
      </Box> */}

      <Box bg={bg} className="box wide">
        <TemperatureGraph data={data} />
      </Box>
    </div>
  );
};

export default AnalyticsMain;
