"use client";

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
import LowTemperature from "../forms/wind/LowTemperature";
import HighTemperature from "../forms/wind/HighTemperature";
import LowPressure from "../forms/wind/LowPressure";
import HighPressure from "../forms/wind/HighPressure";

// Alert type components
const AlertWindSpeed: React.FC = () => <WindSpeedForm />;
const AlertRainFall: React.FC = () => <RainFallForm />;
const AlertLowTemp: React.FC = () => <LowTemperature />;
const AlertHighTemp: React.FC = () => <HighTemperature />;
const AlertHighFlow: React.FC = () => <div>Débit élevé - Forte consommation d'eau</div>;
const AlertLowFlow: React.FC = () => <div>Débit faible - Faible consommation d'eau</div>;
const AlertHighPressure: React.FC = () => <HighPressure />;
const AlertLowPressure: React.FC = () => <LowPressure />;

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose }) => {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  // Mapping alert types to components with French translations
  const alertComponents: Record<string, React.FC> = {
    "Débit élevé - Forte consommation d'eau": AlertHighFlow,
    "Débit faible - Faible consommation d'eau": AlertLowFlow,
    "Température basse": AlertLowTemp,
    "Température élevée": AlertHighTemp,
    "Pression élevée": AlertHighPressure,
    "Pression basse": AlertLowPressure,
    "Vitesse du vent": AlertWindSpeed,
    "Précipitations": AlertRainFall,
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
            <Text>{selectedAlert ? selectedAlert : "Alertes disponibles"}</Text>
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
            Fermer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
