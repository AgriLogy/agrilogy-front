"use client";
import React, { useEffect, useState } from "react";
import "./AlertMain.css";
import { Box, Text } from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import LoadingSpinner from "../common/LoadingSpinner";
import DateRangePicker from "../analytics/DateRangePicker";
import useAxiosInstance from "@/app/lib/axiosInstance";
import FloatingButton from "./FloatingButton";
import FormModal from "./FormModal";

const AlertMain: React.FC = () => {
  const { bg, textColor } = useColorModeStyles();
  const [data, setData] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosInstance = useAxiosInstance();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          start_date: startDate,
          end_date: endDate,
        };

        const response = await axiosInstance.get("/api/notifications-and-alerts/", { params });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  if (!data) return <LoadingSpinner />;

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Gestion des alerts</Text>
      </Box>
      {/* Floating Button */}
      <FloatingButton onClick={openModal} />
      {/* Form Modal */}
      <FormModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default AlertMain;
