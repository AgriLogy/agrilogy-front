"use client";
import React, { useEffect, useState } from "react";
import "./MoistureMain.css";
import { Box, Text } from "@chakra-ui/react";
import axiosInstance from "@/app/lib/axiosInstance";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import LoadingSpinner from "../common/LoadingSpinner";
import DateRangePicker from "../analytics/DateRangePicker";


const MoistureMain: React.FC = () => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility
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

        const response = await axiosInstance.get("/api/stationdata/", { params });
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
        <Text color={textColor}>Données sur l'humidité du sol</Text>
      </Box>
      <Box bg={bg} className="header" mt={0} mb={0}>
        <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
      </Box>
     
    </div>
  );
};

export default MoistureMain;
