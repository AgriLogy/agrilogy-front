import React, { useEffect, useState } from 'react';
import {
  Table,
  Text,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  useToast,
  Button,
  Flex,
} from '@chakra-ui/react';
import api from '@/app/lib/api';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import EmptyBox from '../common/EmptyBox';

interface SensorSetting {
  name: string;
  customName: string;
}

const GraphNameSettings = () => {
  const [settings, setSettings] = useState<SensorSetting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();
  const { textColor } = useColorModeStyles();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const graphResponse = await api.get('/api/graph-name/');
        const graphData = graphResponse.data;

        const sensorSettings: SensorSetting[] = Object.keys(graphData).map(
          (key) => ({
            name: key,
            customName: graphData[key],
          })
        );

        setSettings(sensorSettings);
      } catch (error) {
        console.error('Error fetching sensor settings', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (index: number, value: string) => {
    const updatedSettings = [...settings];
    updatedSettings[index].customName = value;
    setSettings(updatedSettings);
  };

  const handleSave = async () => {
    try {
      const graphUpdate = settings.reduce(
        (acc, sensor) => {
          acc[sensor.name] = sensor.customName;
          return acc;
        },
        {} as Record<string, string>
      );

      await api.put(`/api/graph-name/`, graphUpdate);

      toast({
        title: 'Success',
        description: 'Color updated successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating settings', error);
      toast({
        title: 'Error',
        description: 'Failed to update color',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <div>
      {loading ? (
        <EmptyBox />
      ) : (
        <>
          <Text color={textColor}>Paramètres du nom du graphique</Text>

          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Custom Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {settings.map((sensor, index) => (
                <Tr key={sensor.name}>
                  <Td>{sensor.name}</Td>
                  <Td>
                    <Input
                      value={sensor.customName}
                      onChange={(e) => handleChange(index, e.target.value)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Flex justifyContent="center" mt={4}>
            <Button colorScheme="blue" size="lg" onClick={handleSave}>
              Mettre à jour
            </Button>
          </Flex>
        </>
      )}
    </div>
  );
};

export default GraphNameSettings;
