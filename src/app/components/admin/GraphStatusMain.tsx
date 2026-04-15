'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Checkbox,
  SimpleGrid,
  Spinner,
  useToast,
  Divider,
  Select,
} from '@chakra-ui/react';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import axiosInstance from '@/app/lib/api';
import g from '@/app/styles/graphes.module.css';

type Props = {
  user: string;
};

type GraphStatus = {
  [key: string]: boolean;
};

type Zone = {
  id: number;
  name: string;
};

const fieldGroups: Record<string, string[]> = {
  '🌱 Sol': [
    'soil_irrigation_status',
    'soil_ph_status',
    'soil_conductivity_status',
    'soil_moisture_status',
    'soil_temperature_status',
  ],
  '☁️ Météo': [
    'et0_status',
    'wind_speed_status',
    'wind_direction_status',
    'solar_radiation_status',
    'temperature_humidity_weather_status',
    'precipitation_humidity_rate_status',
    'pluviometry_status',
    'data_table_status',
    'wind_radar_status',
    'cumulative_precipitation_status',
    'precipitation_rate_status',
    'weather_temperature_humidity_status',
  ],
  '💧 Eau': [
    'water_flow_status',
    'water_pressure_status',
    'water_ph_status',
    'water_ec_status',
  ],
  '🌿 Plante': [
    'leaf_sensor_status',
    'fruit_size_status',
    'large_fruit_diameter_status',
  ],
  '🌾 Engrais/Nutriments': ['npk_status'],
  '⚡ Autres': ['electricity_consumption_status'],
};

const GraphStatusMain = ({ user }: Props) => {
  const { bg, textColor, hoverColor } = useColorModeStyles();
  const toast = useToast();

  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [graphStatus, setGraphStatus] = useState<GraphStatus>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchZones = async () => {
    try {
      const response = await axiosInstance.get(`/api/active-zones/${user}/`);
      setZones(response.data);
      if (response.data.length > 0) {
        setSelectedZoneId(response.data[0].id);
      }
    } catch {
      toast({
        title: 'Erreur lors du chargement des zones',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const fetchStatus = async (zoneId: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/active-graph/${user}/${zoneId}/`
      );
      setGraphStatus(response.data);
    } catch {
      toast({
        title: 'Erreur lors du chargement des graphiques',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (key: string, value: boolean) => {
    if (!selectedZoneId) return;
    try {
      const updatedStatus = { ...graphStatus, [key]: value };
      await axiosInstance.put(
        `/api/active-graph/${user}/${selectedZoneId}/`,
        updatedStatus
      );
      setGraphStatus(updatedStatus);
      toast({
        title: `"${key.replace(/_/g, ' ')}" mis à jour`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Erreur lors de la mise à jour',
        status: 'error',
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    if (selectedZoneId !== null) {
      fetchStatus(selectedZoneId);
    }
  }, [selectedZoneId]);

  const renderCheckboxGroup = (title: string, fields: string[]) => (
    <Box mb={6} key={title}>
      <Text fontSize="lg" fontWeight="bold" mb={2} color={textColor}>
        {title}
      </Text>
      <SimpleGrid columns={[1, 2, 3]} spacing={3}>
        {fields.map((key) => (
          <Checkbox
            key={key}
            isChecked={graphStatus[key]}
            colorScheme="green"
            onChange={(e) => updateStatus(key, e.target.checked)}
            _hover={{ color: hoverColor }}
          >
            {key.replace(/_/g, ' ')}
          </Checkbox>
        ))}
      </SimpleGrid>
    </Box>
  );

  return (
    <div className={g.container}>
      <Box
        className={g.header}
        bg={bg}
        p={4}
        mb={4}
        borderRadius="md"
        boxShadow="sm"
      >
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Liste des Graphiques pour {user}
        </Text>
        <Box mt={2}>
          <Select
            placeholder="Sélectionner une zone"
            value={selectedZoneId ?? ''}
            onChange={(e) => setSelectedZoneId(parseInt(e.target.value))}
            maxW="300px"
          >
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </Select>
        </Box>
      </Box>

      <Box
        className={g.wide}
        bg={bg}
        p={4}
        mb={4}
        mt={2}
        borderRadius="md"
        boxShadow="sm"
      >
        {loading ? (
          <Spinner />
        ) : (
          Object.entries(fieldGroups).map(([title, fields], index, arr) => (
            <React.Fragment key={title}>
              {renderCheckboxGroup(title, fields)}
              {index < arr.length - 1 && <Divider my={4} />}
            </React.Fragment>
          ))
        )}
      </Box>
    </div>
  );
};

export default GraphStatusMain;
