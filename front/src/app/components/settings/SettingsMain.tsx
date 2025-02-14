"use client";
import React, { useEffect, useState } from "react";
import "./SettingsMain.css";
import { Box, Text } from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import LoadingSpinner from "../common/LoadingSpinner";
import DateRangePicker from "../analytics/DateRangePicker";
import axiosInstance from "@/app/lib/api";

const SettingsMain: React.FC = () => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Paramètres</Text>
      </Box>
      
    </div>
  );
};

export default SettingsMain;
