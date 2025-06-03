import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { FaBolt } from "react-icons/fa";
import { SensorData } from "@/app/types";

const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `${diffMin} min`;
  if (diffH < 24) return `${diffH} h`;
  return then.toLocaleDateString();
};

const WindSpeedLastData = ({ data }: { data: SensorData[] }) => {
  const latest = data[data.length - 1];

  // Light/Dark mode colors
  const bgColor = useColorModeValue("blue.50", "blue.900");
  const valueColor = useColorModeValue("blue.700", "blue.200");
  const textColor = useColorModeValue("gray.600", "gray.300");
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
      <FaBolt size={50} color="#f4a261" />
      <Text fontWeight="bold" fontSize="lg" mt={2}>
        Dernière vitesse du vent :
      </Text>
      <Text fontSize="2xl" color={valueColor}>
        {latest ? `${latest.value.toFixed(2)} ${latest.default_unit}` : "N/A"}
      </Text>
      <Text fontSize="sm" color={timeColor}>
        {latest ? `Mise à jour : ${timeAgo(latest.timestamp)}` : ""}
      </Text>
    </Box>
  );
};

export default WindSpeedLastData;
