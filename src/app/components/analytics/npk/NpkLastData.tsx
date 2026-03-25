import { Box, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { GiChemicalDrop } from 'react-icons/gi';
import { NpkSensorData } from '@/app/types';
import { formatNumber } from '@/app/utils/formatNumber';

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

const NpkLastData = ({ data }: { data: NpkSensorData[] }) => {
  const latest = data[data.length - 1];

  // Light/dark mode colors
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const noDataColor = useColorModeValue('gray.600', 'gray.300');
  const timeColor = useColorModeValue('gray.500', 'gray.400');
  const textColor = useColorModeValue('gray.600', 'gray.300');

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
      <GiChemicalDrop size={50} color="#2B6CB0" />
      <Text fontWeight="bold" fontSize="lg" mt={2} color={textColor}>
        Dernières valeurs NPK
      </Text>

      {latest ? (
        <VStack spacing={1} mt={3}>
          <Text fontSize="lg" color={latest.nitrogen_color}>
            Azote (N):{' '}
            {latest.nitrogen_value != null
              ? formatNumber(latest.nitrogen_value)
              : 'N/A'}{' '}
            mg/kg
          </Text>
          <Text fontSize="lg" color={latest.phosphorus_color}>
            Phosphore (P):{' '}
            {latest.phosphorus_value != null
              ? formatNumber(latest.phosphorus_value)
              : 'N/A'}{' '}
            mg/kg
          </Text>
          <Text fontSize="lg" color={latest.potassium_color}>
            Potassium (K):{' '}
            {latest.potassium_value != null
              ? formatNumber(latest.potassium_value)
              : 'N/A'}{' '}
            mg/kg
          </Text>
        </VStack>
      ) : (
        <Text mt={3} fontSize="md" color={noDataColor}>
          N/A
        </Text>
      )}

      {latest && (
        <Text fontSize="sm" color={timeColor} mt={3}>
          Mise à jour : {timeAgo(latest.timestamp)}
        </Text>
      )}
    </Box>
  );
};

export default NpkLastData;
