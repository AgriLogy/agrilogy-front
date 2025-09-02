import { Box, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { WiHumidity, WiThermometer } from "react-icons/wi";

interface WeatherData {
  timestamp: string;
  value: number;
  default_unit: string;
}

const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);

  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `${diffMin} min.`;
  if (diffH < 24) return `${diffH} heures`;
  return then.toLocaleDateString();
};

const TempuratureHumidtyLastData = ({
  humidityData,
  temperatureData,
}: {
  humidityData: WeatherData[];
  temperatureData: WeatherData[];
}) => {
  const latestHumidity = humidityData[humidityData.length - 1];
  const latestTemperature = temperatureData[temperatureData.length - 1];

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const timeColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="md"
      boxShadow="md"
      minH="300px"
      minW="250px"
      height="100%"
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <Text fontWeight="bold" fontSize="lg" mb={2} color={textColor}>
        Dernières valeurs météo
      </Text>

      <VStack spacing={3}>
        {latestTemperature ? (
          <Text fontSize="lg" color="red.400">
            <WiThermometer size={24} style={{ display: "inline" }} /> Température :
            {` ${latestTemperature.value.toFixed(2)} ${latestTemperature.default_unit}`}
          </Text>
        ) : (
          <Text color={textColor}>Température : N/A</Text>
        )}

        {latestHumidity ? (
          <Text fontSize="lg" color="blue.400">
            <WiHumidity size={24} style={{ display: "inline" }} /> Humidité :
            {` ${latestHumidity.value.toFixed(2)} ${latestHumidity.default_unit}`}
          </Text>
        ) : (
          <Text color={textColor}>Humidité : N/A</Text>
        )}

        {latestTemperature && (
          <Text fontSize="sm" color={timeColor} mt={2}>
            Mise à jour : {timeAgo(latestTemperature.timestamp)}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default TempuratureHumidtyLastData;
