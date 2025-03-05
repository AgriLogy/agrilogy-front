// components/Alert.tsx
import React from "react";
import { Box, Text, Badge, Divider } from "@chakra-ui/react";

// Define types for the alert data
interface AlertProps {
  id: number;
  name: string;
  type: string;
  description: string;
  condition: string;
}

const Alert: React.FC<AlertProps> = ({ id, name, type, description, condition }) => {
  return (
    <Box
      p={6}
      key={id}
      borderWidth={1}
      width="100%"
      borderRadius="md"
      overflowY="auto"
      bg="white"
      boxShadow="lg"
      transition="transform 0.3s ease, box-shadow 0.3s ease"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "xl",
      }}
    >
      {/* Alert Name and Type */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold" fontSize="xl" color="gray.800">
          {name}
        </Text>
        <Badge colorScheme="blue" fontSize="sm" p={2}>
          {type}
        </Badge>
      </Box>

      {/* Condition Section */}
      <Box mt={4} p={3} bg="gray.50" borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          ⚡ Condition
        </Text>
        <Text color="gray.600">
          <strong>Condition:</strong> {condition}
        </Text>
      </Box>

      {/* Description Section */}
      <Box mt={4} p={3} bg="gray.50" borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          📜 Description
        </Text>
        <Text color="gray.600">{description}</Text>
      </Box>

      {/* Divider */}
      <Divider mt={4} borderColor="gray.200" />
    </Box>
  );
};

export default Alert;
