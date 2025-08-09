"use client";

import api, { API_URL } from "@/app/lib/api";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

interface ZoneModalAddForm {
  isOpen: boolean;
  onClose: () => void;
  user: string;
}

const ZoneModalAddForm = ({ isOpen, onClose, user }: ZoneModalAddForm) => {
  const [name, setName] = useState("");
  const [space, setSpace] = useState("");
  const [kc, setKc] = useState("");
  const [soilType, setSoilType] = useState("loamy");
  const [flow_rate, setFlow_rate] = useState("");
  const [criticalMoistureThreshold, setCriticalMoistureThreshold] =
    useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!name || !space || !kc || !criticalMoistureThreshold) {
      toast({
        title: "Champs requis.",
        description: "Veuillez remplir tous les champs.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user: user,
        name: name,
        space: parseFloat(space),
        kc: parseFloat(kc),
        soil_type: soilType,
        critical_moisture_threshold: parseFloat(criticalMoistureThreshold),
        flow_rate: flow_rate,
      };

      await axios
        .post(`${API_URL}api/zone-per-user/${user}/`, payload)
        .then((response) => {
          console.log(response.data);
        });
      // await axios.post(`/admin/zone-per-user/${user}/`, payload);

      toast({
        title: "Zone ajoutée.",
        description: `La zone ${name} a été créée pour ${user}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      window.location.reload();

      onClose();
      setName("");
      setSpace("");
      setKc("");
      setCriticalMoistureThreshold("");
      setSoilType("loamy");
    } catch (error: any) {
      toast({
        title: "Erreur lors de la création.",
        description:
          error?.response?.data?.detail || "Une erreur s'est produite.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ajouter une nouvelle zone pour {user}</ModalHeader>
        <ModalBody pb={6}>
          <FormControl isRequired>
            <FormLabel>Nom de la zone</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="zone1"
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Superficie (m²)</FormLabel>
            <Input
              type="number"
              value={space}
              onChange={(e) => setSpace(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Coefficient kc</FormLabel>
            <Input
              type="number"
              value={kc}
              onChange={(e) => setKc(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Type de sol</FormLabel>
            <Select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
            >
              <option value="clay">Argileux</option>
              <option value="loamy">Limoneux</option>
              <option value="sandy">Sableux</option>
              <option value="others">Autre</option>
            </Select>
          </FormControl>

          <FormControl mt={4} isRequired>
            <FormLabel>Seuil critique d'humidité (%)</FormLabel>
            <Input
              type="number"
              value={criticalMoistureThreshold}
              onChange={(e) => setCriticalMoistureThreshold(e.target.value)}
            />
          </FormControl>
          <FormControl>
                <FormLabel>Débit d'aeau (L/s)</FormLabel>
                <Input
                  type="number"
                  value={flow_rate}
                  onChange={(e) => setFlow_rate(e.target.value)}
                />
              </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Créer
          </Button>
          <Button onClick={onClose}>Annuler</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ZoneModalAddForm;
