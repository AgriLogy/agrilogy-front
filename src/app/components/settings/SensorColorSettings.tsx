'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Text,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  useToast,
} from '@chakra-ui/react';
import api from '@/app/lib/api';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import EmptyBox from '../common/EmptyBox';

const SensorColorSettings = () => {
  const { textColor } = useColorModeStyles();

  const [sensorColors, setSensorColors] = useState<Record<
    string,
    string
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await api.get('/api/sensor-color/');
        setSensorColors(response.data);
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to fetch sensor colors',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchColors();
  }, [toast]);

  const handleColorChange = (key: string, value: string) => {
    setSensorColors((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  const saveChanges = async (key: string, value: string) => {
    try {
      await api.put('/api/sensor-color/', { [key]: value });
      toast({
        title: 'Success',
        description: 'Color updated successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update color',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) return <EmptyBox variant="loading" />;

  return (
    <Box overflowX="auto">
      <Text color={textColor}>Paramètres des couleurs des courbes</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Color</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sensorColors &&
            Object.entries(sensorColors).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key.replace(/_/g, ' ')}</Td>
                <Td>
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    onBlur={() => saveChanges(key, sensorColors[key])}
                    width="50px"
                    p="0"
                  />
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default SensorColorSettings;
