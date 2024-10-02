"use client";
import React, { useEffect, useState } from "react";
import "./AnalyticsMain.css";
import { Box, useColorMode, Text } from "@chakra-ui/react";
import IrrigationGraph from "./IrrigationGraph";
import axiosInstance from "@/app/lib/axiosInstance";
import PhGraph from "./PhGraph";

const AnalyticsMain = () => {
  const { colorMode } = useColorMode();
  const [data, setData] = useState<any>(null); // State to hold the fetched data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:8000/api/all-data/"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
        bg={colorMode === "light" ? "gray.200" : "gray.800"}
        className="box wide"
      >
        <IrrigationGraph sensorData={data.sensor_data} />
        <Box
          bg={colorMode === "light" ? "gray.200" : "gray.700"}
          className="box wide"
        ></Box>
      </Box>
      <Box
        bg={colorMode === "light" ? "gray.200" : "gray.800"}
        className="box wide"
      >
        <PhGraph data={data.ph_data} />
        <Box
          bg={colorMode === "light" ? "gray.200" : "gray.700"}
          className="box wide"
        ></Box>
      </Box>
    </div>
  );
};

export default AnalyticsMain;