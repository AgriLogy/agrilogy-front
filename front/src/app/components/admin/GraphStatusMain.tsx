"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Checkbox,
  Spinner,
  useToast,
  SimpleGrid,
} from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import api from "@/app/lib/api";

type Props = {
  user: string;
};

type GraphStatus = {
  [key: string]: boolean;
};

const GraphStatusMain = ({ user }: Props) => {
  const { bg, textColor, hoverColor } = useColorModeStyles();
  const [graphStatus, setGraphStatus] = useState<GraphStatus>({});
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  const fetchStatus = async () => {
    try {
      const response = await api.get(`/api/sensor-activation/${user}/`);
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
      await api.put(`/api/sensor-activation/${user}/`, updatedStatus);
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

  return (
    <div className="container">
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
        <Text color={textColor} fontSize="xl" mb={2}>
          Liste des Graphiques pour {user}
        </Text>
        {loading ? (
          <Spinner />
        ) : (
          <SimpleGrid columns={[1, 2, 3]} spacing={3}>
            {Object.entries(graphStatus).map(([key, value]) => (
              <Checkbox
                key={key}
                isChecked={value}
                colorScheme="green"
                onChange={(e) => updateStatus(key, e.target.checked)}
                _hover={{ color: hoverColor }}
              >
                {key.replace(/_/g, " ")}
              </Checkbox>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </div>
  );
};

export default GraphStatusMain;
