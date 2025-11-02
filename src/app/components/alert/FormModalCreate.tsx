"use client";

import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  VStack,
  Flex,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

import api from "@/app/lib/api";
import { ALERT_CHOICES, CONDITION_CHOICES } from "@/app/utils/alertChoices";

interface FormModalCreateProps {
  isOpen: boolean;
  onClose: () => void;
  refreshAlerts: () => Promise<void>; // Ajouter la fonction refreshAlerts dans les props
}

const FormModalCreate: React.FC<FormModalCreateProps> = ({
  isOpen,
  onClose,
  refreshAlerts,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "Pressure",
    condition: ">",
    description: "",
    condition_nbr: 0,
  });

  const toast = useToast();

  const handleTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      condition: e.target.value,
    }));
  };

  const handleConditionNbrChange = (valueAsNumber: number) => {
    setFormData((prev) => ({
      ...prev,
      condition_nbr: valueAsNumber,
    }));
  };

  const handleSubmit = async () => {
    try {
      await api.post(`/api/alert/`, formData); // Utiliser POST pour la création
      toast({
        title: "Alerte créée",
        description: "L'alerte a été créée avec succès.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await refreshAlerts(); // Rafraîchir la liste des alertes après la création
      onClose();
    } catch (error) {
      toast({
        title: "Erreur lors de la création de l'alerte",
        description: "La création de l'alerte a échoué.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Créer une nouvelle alerte</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Nom */}
            <FormControl isRequired>
              <FormLabel>Nom</FormLabel>
              <Input
                name="name"
                placeholder="Entrez le nom de l'alerte"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>

            {/* Type */}
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleTypeChange}
              >
                {ALERT_CHOICES.map((alert) => (
                  <option key={alert.value} value={alert.value}>
                    {alert.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Condition */}
            <FormControl isRequired>
              <FormLabel>Condition</FormLabel>
              <Flex direction="row" align="center" gap={4}>
                <Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleConditionChange}
                  w="auto"
                >
                  {CONDITION_CHOICES.map((condition) => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </Select>

                <NumberInput
                  name="condition_nbr"
                  min={1}
                  max={100}
                  value={formData.condition_nbr}
                  onChange={(_, valueAsNumber) =>
                    handleConditionNbrChange(valueAsNumber)
                  }
                  w="100px"
                >
                  <NumberInputField name="condition_nbr" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
            </FormControl>

            {/* Description */}
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                placeholder="Entrez la description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Créer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormModalCreate;
