"use client";
import React, { useEffect, useState } from "react";
import "./AnalyticsMain.css";
import { Box, useColorMode, Text } from "@chakra-ui/react";
import IrrigationGraph from "./IrrigationGraph";
import axiosInstance from "@/app/lib/axiosInstance";
import PhGraph from "./PhGraph";
import DateRangePicker from "./DateRangePicker";

const AnalyticsMain: React.FC = () => {
  const { colorMode } = useColorMode();
  const [data, setData] = useState<any>(null); 
  const [startDate, setStartDate] = useState<string>(""); 
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

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
  }, [startDate, endDate]); // Re-fetch data when dates change

  if (!data) return <div>Loading...</div>;

  return (
    <div className="container">
      <Box
        bg={colorMode === "light" ? "gray.200" : "gray.800"}
        className="header"
      >
        <Text color={colorMode === "light" ? "gray.800" : "gray.200"}>
          Données sur le sol
        </Text>
      </Box>

      <Box
        bg={colorMode === "light" ? "gray.200" : "gray.800" } className="header" mt={0} mb={0}>
        <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
      </Box>

      <Box bg={colorMode === "light" ? "gray.200" : "gray.800"} className="box wide">
        <IrrigationGraph sensorData={data.sensor_data} />
      </Box>

      <Box bg={colorMode === "light" ? "gray.200" : "gray.800"} className="box wide">
        <PhGraph data={data.ph_data} />
      </Box>
    </div>
  );
};

export default AnalyticsMain;
