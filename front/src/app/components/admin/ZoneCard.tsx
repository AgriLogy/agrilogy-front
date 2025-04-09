// components/ZoneCard.tsx
import React from "react";
import { Box, Text, Badge } from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";

interface Zone {
  id: number;
  name: string;
  space: number;
  kc: number;
  soil_type: "clay" | "loamy" | "sandy" | "others";
  critical_moisture_threshold: number;
}

interface Props {
  zone: Zone;
  onClick: () => void;
}

const ZoneCard: React.FC<Props> = ({ zone, onClick }) => {
  const { bg, hoverColor, textColor } = useColorModeStyles();

  return (
    <Box
      bg={bg}
      p={4}
      borderWidth="1px"
      borderRadius="xl"
      boxShadow="md"
      _hover={{ cursor: "pointer", borderColor: hoverColor }}
      onClick={onClick}
    >
      <Text fontWeight="bold" fontSize="lg" color={textColor}>
        {zone.name}
      </Text>
      <Text color={textColor}>📏 Space: {zone.space} m²</Text>
      <Text color={textColor}>🌿 KC: {zone.kc}</Text>
      <Text color={textColor}>
        🧱 Soil: <Badge colorScheme="teal">{zone.soil_type}</Badge>
      </Text>
      <Text color={textColor}>
        💧 Threshold: {zone.critical_moisture_threshold}%
      </Text>
    </Box>
  );
};

export default ZoneCard;
