"use client";
import React from "react";
import "./MainContent.css"; // Assuming you will include styles here
import { Box, useColorMode, Text } from "@chakra-ui/react"; // Import Box and useColorMode from Chakra UI
import Zones from "./Zones";
import SensorDataTable from "../SensorDataTable";
import { data } from "@/app/data/dashboard/data";
import SensorDataChart from "../SensorDataChart";

export const MainContent = () => {
  const { colorMode } = useColorMode();

  return (
    <div className="container">
      <Box
        bg={colorMode === "light" ? "gray.200" : "gray.700"}
        className="header"
      >
        <Text
        color={colorMode === "light" ? "gray.700" : "gray.200"}
        
        >Dashboard</Text>
      </Box>
      <Box bg={colorMode === "light" ? "gray.200" : "gray.700"} className="box">
        <Zones />
      </Box>
      <Box bg={colorMode === "light" ? "gray.200" : "gray.700"} className="box">
        2
      </Box>
      <Box bg={colorMode === "light" ? "gray.200" : "gray.700"} className="box">
        <SensorDataTable data={data} />
      </Box>
      <Box bg={colorMode === "light" ? "gray.200" : "gray.700"} className="box">
        <SensorDataChart data={data} />
      </Box>
      {/* <Box
        bg={colorMode === "light" ? "gray.200" : "gray.700"}
        className="box wide"
      >
        5
      </Box> */}
    </div>
  );
};
