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
} from "@chakra-ui/react";
import WindSpeedForm from "../forms/wind/WindSpeedForm";

// Define the components for each alert type
const AlertType1: React.FC = () => <WindSpeedForm/>;
const AlertType2: React.FC = () => <div>Content for Alert Type 2</div>;
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
    "Type 2": AlertType2,
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
          {selectedAlert ? selectedAlert : "Available Alerts"}
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
          {selectedAlert ? (
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
