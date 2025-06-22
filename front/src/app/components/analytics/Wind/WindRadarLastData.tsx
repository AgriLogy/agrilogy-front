import useColorModeStyles from "@/app/utils/useColorModeStyles";
import { Box, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { WiStrongWind } from "react-icons/wi";

interface WindData {
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

const WindRadarLastData = ({
  windSpeedData,
  windDirectionData,
}: {
  windSpeedData: WindData[];
  windDirectionData: WindData[];
}) => {
  const latestSpeed = windSpeedData[windSpeedData.length - 1];
  const latestDirection = windDirectionData[windDirectionData.length - 1];

  const bgColor = useColorModeValue("green.50", "green.900");
  const noDataColor = useColorModeValue("gray.600", "gray.300");
  const timeColor = useColorModeValue("gray.500", "gray.400");
  const { textColor } = useColorModeStyles();


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
      <WiStrongWind size={50} color="#2F855A" />
      <Text fontWeight="bold" fontSize="lg" mt={2} color={textColor}>
        Données récentes du vent
      </Text>

      {latestSpeed && latestDirection ? (
        <VStack spacing={2} mt={3}>
          <Text fontSize="lg">
            Vitesse du vent : {latestSpeed.value.toFixed(2)}{" "}
            {latestSpeed.default_unit}
          </Text>
          <Text fontSize="lg">
            Direction du vent : {latestDirection.value.toFixed(2)}{" "}
            {latestDirection.default_unit}
          </Text>
        </VStack>
      ) : (
        <Text mt={3} fontSize="md" color={noDataColor}>
          N/A
        </Text>
      )}

      {latestSpeed && (
        <Text fontSize="sm" color={timeColor} mt={3}>
          Mise à jour : {timeAgo(latestSpeed.timestamp)}
        </Text>
      )}
    </Box>
  );
};

export default WindRadarLastData;
