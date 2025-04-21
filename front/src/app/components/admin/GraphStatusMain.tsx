"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Checkbox,
  VStack,
  Spinner,
  useToast,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import axiosInstance from "@/app/lib/api";

type Props = {
  user: string;
};

type GraphStatus = {
  [key: string]: boolean;
};

// Group keys based on your model
const soilFields = [
  "soil_irrigation_status",
  "soil_ph_status",
  "soil_conductivity_status",
  "soil_moisture_status",
  "soil_temperature_status",
];

const meteoFields = [
  "et0_status",
  "precipitation_rate_status",
  "wind_speed_status",
  "solar_radiation_status",
  "pressure_weather_status",
  "wind_direction_status",
  "humidity_weather_status",
  "temperature_weather_status",
  "temperature_humidity_weather_status",
  "precipitation_humidity_rate_status",
  "pluviometrie_status",
  "data_table_status",
];

const GraphStatusMain = ({ user }: Props) => {
  const { bg, textColor, hoverColor } = useColorModeStyles();
  const [graphStatus, setGraphStatus] = useState<GraphStatus>({});
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  const fetchStatus = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/sensor-activation/${user}/`
      );
      setGraphStatus(response.data);
    } catch (error) {
      toast({
        title: "Erreur lors du chargement",
        status: "error",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (key: string, value: boolean) => {
    try {
      const updatedStatus = { ...graphStatus, [key]: value };
      await axiosInstance.put(`/api/sensor-activation/${user}/`, updatedStatus);
      setGraphStatus(updatedStatus);
      toast({
        title: `Graphique "${key}" mis à jour`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la mise à jour",
        status: "error",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const renderCheckboxGroup = (title: string, fields: string[]) => (
    <Box mb={6}>
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
            {key.replace(/_/g, " ")}
          </Checkbox>
        ))}
      </SimpleGrid>
    </Box>
  );

  return (
    <div className="container">
      <Box
        className="header wide"
        bg={bg}
        p={2}
        // mb={4}
        margin={1}
        mt={1}
        borderRadius="md"
        boxShadow="sm"
      >
        <Text color={textColor} fontSize="xl" mb={4}>
          Liste des Graphiques pour {user}
        </Text>
      </Box>

      <Box
        className="header wide"
        bg={bg}
        p={4}
        mb={4}
        margin={1}
        mt={2}
        borderRadius="md"
        boxShadow="sm"
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            {renderCheckboxGroup("🌱 Données du sol", soilFields)}
            <Divider my={4} />
            {renderCheckboxGroup("☁️ Données météo", meteoFields)}
          </>
        )}
      </Box>
    </div>
  );
};

export default GraphStatusMain;
