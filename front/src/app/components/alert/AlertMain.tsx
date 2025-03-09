import React, { useEffect, useState } from "react";
import { Box, Text, VStack, useToast } from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import LoadingSpinner from "../common/LoadingSpinner";
import axiosInstance from "@/app/lib/api";
import FloatingButton from "./FloatingButton";
import FormModalUpdate from "./FormModalUpdate";
import FormModalCreate from "./FormModalCreate";
import Alert from "../notifications/Alert";
import "../../styles/style.css"

interface AlertData {
  id: number;
  name: string;
  type: string;
  description: string;
  condition: string;
  condition_nbr: number;
  user: number;
}

const AlertMain = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false); // To determine which modal to open
  const toast = useToast();

  const { bg, textColor } = useColorModeStyles();

  const openCreateModal = () => {
    if (alerts.length >= 3) {
      toast({
        title: "Supprimer des alertes pour pouvoir en créer d'autres",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return; // Prevent opening the create modal
    }
    setIsCreateModal(true);
    setIsModalOpen(true);
  };

  const openUpdateModal = (alert: AlertData) => {
    setSelectedAlert(alert);
    setIsCreateModal(false); // Set to false since it's for update
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null); // Reset selected alert
  };

  const fetchAlerts = async () => {
    try {
      const response = await axiosInstance.get("/api/alert/");
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleDeleteAlert = async (alertId: number) => {
    try {
      await axiosInstance.delete(`/api/alert/${alertId}/`);
      toast({
        title: "Alerte supprimée",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      closeModal();
      fetchAlerts(); // Rafraîchir la liste des alertes après la suppression
    } catch (error) {
      console.error("Erreur lors de la suppression de l'alerte :", error);
      toast({
        title: "Erreur lors de la suppression de l'alerte",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Gestion des alerts</Text>
      </Box>

      <VStack mt={4} spacing={4} align="stretch" className="wide">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            id={alert.id}
            name={alert.name}
            type={alert.type}
            description={alert.description}
            condition={alert.condition}
            condition_nbr={alert.condition_nbr}
            onClick={() => openUpdateModal(alert)} // Open update modal when alert is clicked
          />
        ))}
      </VStack>

      {/* Floating Button to Create New Alert */}
      <FloatingButton onClick={openCreateModal} />

      {/* Modal for Create and Update */}
      {isModalOpen &&
        (isCreateModal ? (
          <FormModalCreate
            isOpen={isModalOpen}
            onClose={closeModal}
            refreshAlerts={fetchAlerts} // Refresh alerts after create
          />
        ) : (
          <FormModalUpdate
            isOpen={isModalOpen}
            onClose={closeModal}
            initialData={selectedAlert} // Pass the selected alert for updating
            onDelete={() => handleDeleteAlert(selectedAlert?.id!)} // Delete handler
            refreshAlerts={fetchAlerts} // Refresh alerts after update
          />
        ))}
    </div>
  );
};

export default AlertMain;
