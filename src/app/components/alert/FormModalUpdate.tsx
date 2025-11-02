import React, { useState, useEffect } from "react";
import {
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
import { ALERT_CHOICES } from "@/app/utils/alertChoices";

interface FormModalUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: any;
  onDelete: () => void;
  refreshAlerts: () => void;
}

const FormModalUpdate: React.FC<FormModalUpdateProps> = ({
  isOpen,
  onClose,
  initialData,
  onDelete,
  refreshAlerts,
}) => {
  const [formData, setFormData] = useState({
    id: "", // Add id here
    name: "",
    type: "Vitesse du vent",
    condition: ">",
    description: "",
    condition_nbr: 0,
  });

  const toast = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData); // Make sure initialData includes id
    }
  }, [initialData]);

  // Get the label of the selected type
  const getTypeLabel = (type: string) => {
    const typeObj = ALERT_CHOICES.find((alert) => alert.value === type);
    return typeObj ? typeObj.label : type; // Return label if found, else return the value itself
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handlecondition_nbrChange = (valueAsNumber: number) => {
    setFormData((prev) => ({
      ...prev,
      condition_nbr: valueAsNumber,
    }));
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/api/alert/${formData.id}/`, formData); // Use PUT for update
      toast({
        title: "Alerte mise à jour",
        description: "L'alerte a été mise à jour avec succès.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refreshAlerts(); // Rafraîchir la liste après la mise à jour
      onClose();
    } catch (error) {
      toast({
        title: "Erreur de mise à jour de l'alerte",
        description: "Échec de la mise à jour de l'alerte.",
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
        <ModalHeader>Modifier l'alerte</ModalHeader>
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
            <FormControl isReadOnly>
              <FormLabel>Type</FormLabel>
              <Input name="type" value={getTypeLabel(formData.type)} isReadOnly />
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
                  <option value=">">Supérieur à</option>
                  <option value="<">Inférieur à</option>
                  <option value="=">Égal à</option>
                </Select>

                <NumberInput
                  name="condition_nbr"
                  min={1}
                  max={100}
                  value={formData.condition_nbr}
                  onChange={(_, valueAsNumber) => handlecondition_nbrChange(valueAsNumber)}
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
          <Button variant="ghost" onClick={onDelete}>
            Supprimer
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} ml={3}>
            Mettre à jour
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormModalUpdate;
