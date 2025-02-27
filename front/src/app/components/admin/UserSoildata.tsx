"use client";
import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import "./style.css";
import LoadingSpinner from "../common/LoadingSpinner";
import axiosInstance from "@/app/lib/api";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import DateRangePicker from "../analytics/DateRangePicker";
import TemperatureGraph from "../analytics/TemperatureGraph";
// import IrrigationGraph from "../analytics/IrrigationGraph";
import PhGraph from "../analytics/PhGraph";
import ConductivityIrrigationGraph from "../analytics/ConductivityIrrigationGraph";
import "@/app/styles/graphes.css";

type Props = {
  user: string;
};

const UserAlldata: React.FC<Props> = ({ user }) => {
  const { bg, textColor } = useColorModeStyles();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          user, // Include the user parameter in the POST body
          start_date: startDate,
          end_date: endDate,
        };
        const response = await axiosInstance.post(
          `api/admin-user-data/`,
          payload
        );
        console.log("API Response:", response.data.sensor_data); // Inspect the structure
        setData(response.data.sensor_data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    fetchData();
  }, [user, startDate, endDate]);

  if (error) {
    return (
      <Box>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!data.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container">
      {/* Header */}
      <Box
        className="header"
        bg={bg}
        p={4}
        mb={4}
        borderRadius="md"
        boxShadow="sm"
      >
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Données sur les sols de {user}
        </Text>
      </Box>

      {/* Date Range Picker */}
      <Box bg={bg} className="header" mt={0} mb={0}>
        <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
      </Box>
      {/* <Box bg={bg} className="box wide">
        <IrrigationGraph data={data} />
      </Box> */}
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

export default UserAlldata;
