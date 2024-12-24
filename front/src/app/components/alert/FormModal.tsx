"use client"; // Ensure client-side rendering for Next.js

import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  List,
  ListItem,
  IconButton,
  Flex,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import WindSpeedForm from "../forms/wind/WindSpeedForm";
import RainFallForm from "../forms/wind/RainFallForm";

// Define the components for each alert type
const AlertType1: React.FC = () => <WindSpeedForm />;
const AlertType2: React.FC = () => <RainFallForm />;
const AlertType3: React.FC = () => <div>Content for Alert Type 3</div>;

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose }) => {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  // Map alert types to their respective components
  const alertComponents: Record<string, React.FC> = {
    "Wind Speed": AlertType1,
    "Rain Fall": AlertType2,
    "Type 3": AlertType3,
  };

  const handleAlertClick = (type: string) => {
    setSelectedAlert(type);
  };

  const handleBack = () => {
    setSelectedAlert(null);
  };

  const SelectedComponent = selectedAlert ? alertComponents[selectedAlert] : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>
          <Flex align="center">
            {selectedAlert && (
              <IconButton
                aria-label="Back"
                icon={<ArrowBackIcon />}
                onClick={handleBack}
                variant="ghost"
                mr={2}
              />
            )}
            <Text>{selectedAlert ? selectedAlert : "Available Alerts"}</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!selectedAlert ? (
            <List spacing={3}>
              {Object.keys(alertComponents).map((alert) => (
                <ListItem key={alert}>
                  <Button
                    variant="link"
                    onClick={() => handleAlertClick(alert)}
                    _hover={{ textDecoration: "underline", color: "blue.500" }}
                  >
                    {alert}
                  </Button>
                </ListItem>
              ))}
            </List>
          ) : (
            <SelectedComponent />
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
