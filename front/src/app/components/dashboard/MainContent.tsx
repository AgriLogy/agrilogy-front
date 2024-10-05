"use client";
import React from "react";
import "./MainContent.css"; // Assuming you will include styles here
import { Box, Text } from "@chakra-ui/react"; // Import Box from Chakra UI
import Zones from "./Zones";
import SensorDataTable from "../SensorDataTable";
import SensorDataChart from "../SensorDataChart";
import { data } from "@/app/data/dashboard/data";
import useColorModeStyles from "@/app/utils/useColorModeStyles";

export const MainContent = () => {
  const { bg, textColor } = useColorModeStyles(); // Use your utility

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Dashboard</Text>
      </Box>
      <Box bg={bg} className="box">
        <Zones />
      </Box>
      <Box bg={bg} className="box">
        2
      </Box>
      <Box bg={bg} className="box">
        <SensorDataTable data={data} />
      </Box>
      <Box bg={bg} className="box">
        <SensorDataChart data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        5
      </Box>
    </div>
  );
};
