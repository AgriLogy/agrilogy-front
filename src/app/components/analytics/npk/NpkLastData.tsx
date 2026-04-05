import { Box, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { GiChemicalDrop } from 'react-icons/gi';
import { NpkSensorData } from '@/app/types';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import {
  formatCalibratedReading,
  resolveAxisUnit,
} from '@/app/utils/unitOverrides';
import { getCatalogDefaultUnit } from '@/app/utils/sensorCatalog';
import LastDataAddAlertButton from '../../common/LastDataAddAlertButton';

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
  useUnitOverridesRevision();

  const npkFallback = latest?.default_unit ?? getCatalogDefaultUnit('npk_n');
  const unitN = resolveAxisUnit('npk_n', npkFallback);
  const unitP = resolveAxisUnit('npk_p', npkFallback);
  const unitK = resolveAxisUnit('npk_k', npkFallback);

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
            Azote (N): {formatCalibratedReading('npk_n', latest.nitrogen_value)}{' '}
            {unitN}
          </Text>
          <Text fontSize="lg" color={latest.phosphorus_color}>
            Phosphore (P):{' '}
            {formatCalibratedReading('npk_p', latest.phosphorus_value)} {unitP}
          </Text>
          <Text fontSize="lg" color={latest.potassium_color}>
            Potassium (K):{' '}
            {formatCalibratedReading('npk_k', latest.potassium_value)} {unitK}
          </Text>
        </VStack>
      ) : (
        <Text mt={3} fontSize="md" color={noDataColor}>
          Non disponible
        </Text>
      )}

      {latest && (
        <Text fontSize="sm" color={timeColor} mt={3}>
          Mise à jour : {timeAgo(latest.timestamp)}
        </Text>
      )}
      <LastDataAddAlertButton />
    </Box>
  );
};

export default NpkLastData;
