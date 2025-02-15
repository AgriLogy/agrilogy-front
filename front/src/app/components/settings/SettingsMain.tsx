"use client";
import React, { useEffect, useState } from "react";
import "./SettingsMain.css";
import { Box, Text } from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import SensorColorSettings from "./SensorColorSettings";
import GraphNameSettings from "./GraphNameSettings";

const SettingsMain = () => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Paramètres</Text>
      </Box>
      <Box bg={bg} className="wide text-box">
        <SensorColorSettings />
      </Box>
      <Box bg={bg} className="wide text-box">
        <GraphNameSettings />
      </Box>
    </div>
  );
};

export default SettingsMain;
