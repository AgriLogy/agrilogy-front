import React from "react";
import { Box, Text, Badge, Tag } from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import { ZoneCardType } from "@/app/types";

const ZoneCard = ({ zone, onClick }: ZoneCardType) => {
  const { bg, hoverColor, textColor } = useColorModeStyles();

  return (
    <Box
      bg={bg}
      p={2}
      borderWidth="1px"
      borderRadius="xl"
      boxShadow="md"
      _hover={{ cursor: "pointer", borderColor: hoverColor }}
      onClick={onClick}
    >
      <Text fontWeight="bold" fontSize="lg" color={textColor}>
        {zone.name}
      </Text>

      <Text color={textColor} fontSize="sm">
        📏 Space: {zone.space} m²
      </Text>

      <Text color={textColor} fontSize="sm">
        🌿 KC: {zone.kc}
      </Text>

      <Text color={textColor} fontSize="sm">
        🧱 Soil: <Badge colorScheme="teal">{zone.soil_type}</Badge>
      </Text>

      <Text color={textColor} fontSize="sm">
        💧 Threshold:{" "}
        <Tag colorScheme="purple">{zone.critical_moisture_threshold}%</Tag>
      </Text>
    </Box>
  );
};

export default ZoneCard;
