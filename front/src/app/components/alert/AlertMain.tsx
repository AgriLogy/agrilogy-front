"use client";
import React, { useEffect, useState } from "react";
import "./AlertMain.css";
import { Box, Text } from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import LoadingSpinner from "../common/LoadingSpinner";
import axiosInstance from "@/app/lib/api";
import FloatingButton from "./FloatingButton";
import FormModal from "./FormModal";

const AlertMain = () => {
  const { bg, textColor } = useColorModeStyles();
  const [data, setData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/notifications-and-alerts/"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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
