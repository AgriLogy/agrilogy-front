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
        📏 Espace : {zone.space} m²
      </Text>

      <Text color={textColor} fontSize="sm">
        🌱 Plante : <Badge colorScheme="green">{zone.plant_type}</Badge>
      </Text>

      <Text color={textColor} fontSize="sm">
        🧱 Type de sol : <Badge colorScheme="teal">{zone.soil_type}</Badge>
      </Text>

      <Text color={textColor} fontSize="sm">
        🌿 Coefficient (Kc) : {zone.kc}
      </Text>

      <Text color={textColor} fontSize="sm">
        🚿 Méthode d&apos;irrigation : <Tag colorScheme="blue">{zone.irrigation_method}</Tag>
      </Text>

      <Text color={textColor} fontSize="sm">
        🌤️ Et0 : {zone.et0} mm/jour
      </Text>

      <Text color={textColor} fontSize="sm">
        🗓️ Dernière irrigation : {new Date(zone.last_irrigation_date).toLocaleDateString("fr-FR")}
      </Text>
    </Box>
  );
};

export default ZoneCard;
