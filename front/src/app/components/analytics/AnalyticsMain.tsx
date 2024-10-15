"use client";
import React, { useEffect, useState } from "react";
import "./AnalyticsMain.css";
import { Box, Text } from "@chakra-ui/react";
import IrrigationGraph from "./IrrigationGraph";
import axiosInstance from "@/app/lib/axiosInstance";
import PhGraph from "./PhGraph";
import DateRangePicker from "./DateRangePicker";
import ConductivityIrrigationGraph from "./ConductivityIrrigationGraph";
import CumulIrrigationGraph from "./CumulIrrigationGraph";
import TemperatureGraph from "./TemperatureGraph";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import LoadingSpinner from "../common/LoadingSpinner";
import useAxiosInstance from "@/app/lib/axiosInstance";

const AnalyticsMain: React.FC = () => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility
  const [data, setData] = useState<any>(null); 
  const [startDate, setStartDate] = useState<string>(""); 
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          start_date: startDate,
          end_date: endDate,
        };

        const response = await axiosInstance.get("/api/all-data/", { params });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  if (!data) return <LoadingSpinner/>;

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Données sur le sol</Text>
      </Box>

      <Box bg={bg} className="header" mt={0} mb={0}>
        <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
      </Box>

      <Box bg={bg} className="box wide">
        <IrrigationGraph sensorData={data.sensor_data} />
      </Box>

      <Box bg={bg} className="box wide">
        <PhGraph data={data.ph_data} />
      </Box>

      <Box bg={bg} className="box wide">
        <ConductivityIrrigationGraph data={data.conductivity_data} />
      </Box>

      <Box bg={bg} className="box wide">
        <CumulIrrigationGraph data={data.cumul_data} />
      </Box>

      <Box bg={bg} className="box wide">
        <TemperatureGraph data={data.temperature_data} />
      </Box>
    </div>
  );
};

export default AnalyticsMain;
