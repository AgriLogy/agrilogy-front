import { Box, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { WiRaindrop, WiThermometer } from "react-icons/wi";

const SensorLeafLastData = ({
  temperature,
  moisture,
}: {
  temperature?: { value: number; timestamp: string };
  moisture?: { value: number; timestamp: string };
}) => {
  const bgColor = useColorModeValue("green.50", "green.900");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const formatTime = (timestamp: string) => new Date(timestamp).toLocaleString();

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="md"
      boxShadow="md"
      height="100%"
      textAlign="center"
    >
      <Text fontSize="xl" fontWeight="bold" mb={3}>
        Dernières valeurs
      </Text>
      <VStack spacing={2}>
        <Box>
          <WiThermometer size={36} />
          <Text color={textColor} fontSize="lg">
            Température: {temperature?.value.toFixed(2) ?? "N/A"} °C
          </Text>
        </Box>
        <Box>
          <WiRaindrop size={36} />
          <Text color={textColor} fontSize="lg">
            Humidité des feuilles: {moisture?.value.toFixed(2) ?? "N/A"} %
          </Text>
        </Box>
        {(temperature || moisture) && (
          <Text fontSize="sm" color="gray.500">
            Mise à jour : {formatTime(temperature?.timestamp || moisture?.timestamp || "")}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default SensorLeafLastData;
