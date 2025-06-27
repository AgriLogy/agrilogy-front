import { Box, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { WiRaindrop, WiThermometer } from "react-icons/wi";

const SensorLeafLastData = ({
  temperature,
  moisture,
}: {
  temperature?: { value: number; timestamp: string };
  moisture?: { value: number; timestamp: string };
}) => {
  // const bgColor = useColorModeValue("green.50", "green.900");
  // const textColor = useColorModeValue("gray.700", "gray.200");
  const bgColor = useColorModeValue("blue.50", "blue.900");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const timeColor = useColorModeValue("gray.500", "gray.400");

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleString();

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="md"
      boxShadow="md"
      height="100%"
      textAlign="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4} color={textColor}>
        Dernières valeurs
      </Text>

      <VStack spacing={5}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <WiThermometer size={50} color="#FF7300" />
          <Text color={textColor} fontSize="lg" mt={1}>
            Température:{" "}
            {temperature ? `${temperature.value.toFixed(2)} °C` : "N/A"}
          </Text>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center">
          <WiRaindrop size={50} color="#007AFF" />
          <Text color={textColor} fontSize="lg" mt={1}>
            Humidité des feuilles:{" "}
            {moisture ? `${moisture.value.toFixed(2)} %` : "N/A"}
          </Text>
        </Box>

        {(temperature || moisture) && (
          <Text fontSize="sm" color={timeColor} mt={2}>
            Mise à jour :{" "}
            {formatTime(temperature?.timestamp || moisture?.timestamp || "")}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default SensorLeafLastData;
