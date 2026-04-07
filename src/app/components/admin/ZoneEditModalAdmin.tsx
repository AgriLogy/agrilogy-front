// components/ZoneEditModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  VStack,
  Select,
  useToast,
} from '@chakra-ui/react';
import axiosInstance from '@/app/lib/api';
import type { ZoneType } from '@/app/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  zone: ZoneType;
  username: string;
  onUpdate: (zone: ZoneType) => void;
}

const ZoneEditModal = ({
  isOpen,
  onClose,
  zone,
  username,
  onUpdate,
}: Props) => {
  const [formData, setFormData] = useState<ZoneType>(zone);
  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'space' ||
        name === 'kc' ||
        name === 'critical_moisture_threshold'
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.put(
        `/api/mod-zone-per-user/${username}/${zone.id}/`,
        formData
      );
      onUpdate(response.data);
      onClose();
      toast({ title: 'Zone updated', status: 'success' });
      window.location.reload();
    } catch (error) {
      toast({ title: 'Failed to update zone', status: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `/api/mod-zone-per-user/${username}/${zone.id}/`
      );
      onClose();
      toast({ title: 'Zone deleted', status: 'success' });
      // Optionally, refresh the page
      window.location.reload(); // Refresh the page after delete
    } catch (error) {
      toast({ title: 'Failed to delete zone', status: 'error' });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Zone - {zone.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
            />
            <Input
              name="space"
              value={formData.space}
              onChange={handleChange}
              placeholder="Space (m²)"
            />
            <Input
              name="kc"
              value={formData.kc}
              onChange={handleChange}
              placeholder="KC"
            />
            <Select
              name="soil_type"
              value={formData.soil_type}
              onChange={handleChange}
            >
              <option value="clay">Clay</option>
              <option value="loamy">Loamy</option>
              <option value="sandy">Sandy</option>
              <option value="others">Others</option>
            </Select>
            <Input
              name="critical_moisture_threshold"
              value={formData.critical_moisture_threshold}
              onChange={handleChange}
              placeholder="Critical Moisture Threshold (%)"
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" onClick={handleSubmit}>
            Save
          </Button>
          <Button onClick={handleDelete} colorScheme="red" ml={3}>
            Delete
          </Button>
          <Button onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ZoneEditModal;
