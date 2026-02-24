'use client';

import React, { useState } from 'react';
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
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

const HighTemperature: React.FC = () => {
  const [formData, setFormData] = useState({
    alertName: '',
    alertType: 'Weather Temperature - High',
    percentage: 1,
    description: '',
  });

  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handlePercentageChange = (valueAsNumber: number) => {
    setFormData((prev) => ({
      ...prev,
      percentage: valueAsNumber,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/alerts/windspeed', formData);
      toast({
        title: 'Alert Created',
        description: 'Wind speed alert successfully added.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setFormData({
        alertName: '',
        alertType: 'Weather Temperature - Low',
        percentage: 1,
        description: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create wind speed alert.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="100%" p={4} borderRadius="md" overflowY="auto">
      <VStack spacing={4} align="stretch">
        {/* Alert Name */}
        <FormControl isRequired>
          <FormLabel>Alert Name</FormLabel>
          <Input
            name="alertName"
            placeholder="Enter alert name"
            value={formData.alertName}
            onChange={handleChange}
          />
        </FormControl>

        {/* Alert Type */}
        <FormControl isReadOnly>
          <FormLabel>Alert Type</FormLabel>
          <Input name="alertType" value={formData.alertType} isReadOnly />
        </FormControl>

        {/* Percentage */}
        <FormControl isRequired>
          <FormLabel>Percentage [mm/h]</FormLabel>
          <NumberInput
            defaultValue={1}
            min={1}
            max={100}
            value={formData.percentage}
            onChange={(_, valueAsNumber) =>
              handlePercentageChange(valueAsNumber)
            }
          >
            <NumberInputField name="percentage" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        {/* Description */}
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormControl>

        {/* Submit Button */}
        <Button colorScheme="blue" onClick={handleSubmit} w="full">
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default HighTemperature;
