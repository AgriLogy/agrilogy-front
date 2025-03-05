// components/AlertMain.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react"; // Import Chakra UI components
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import LoadingSpinner from "../common/LoadingSpinner";
import axiosInstance from "@/app/lib/api";
import FloatingButton from "./FloatingButton";
import FormModal from "./FormModal";
import Alert from "../notifications/Alert";

// Define types for the alert data
interface AlertData {
  id: number;
  name: string;
  type: string;
  description: string;
  condition: string;
  user: number;
}

const AlertMain = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]); // Use the Alert type here
  const [loading, setLoading] = useState<boolean>(true);

  const { bg, textColor } = useColorModeStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axiosInstance.get("/api/alert/"); // API to fetch alerts
        setAlerts(response.data); // If alerts are directly in the response
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false once the fetch is complete
      }
    };
    fetchAlerts();
  }, []);

  if (loading) return <LoadingSpinner />; // Show loading spinner until data is fetched

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Gestion des alerts</Text>
      </Box>

      {/* Render Alerts */}
        <VStack mt={4} spacing={4} align="stretch">
          {alerts &&
            alerts.map((alert) => (
              <Alert
                key={alert.id}
                id={alert.id}
                name={alert.name}
                type={alert.type}
                description={alert.description}
                condition={alert.condition}
              />
            ))}
        </VStack>

      {/* Floating Button */}
      <FloatingButton onClick={openModal} />

      {/* Form Modal */}
      <FormModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default AlertMain;
