import { Box, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { WiStrongWind } from 'react-icons/wi';
import {
  formatCalibratedReading,
  resolveAxisUnit,
} from '@/app/utils/unitOverrides';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import LastDataAddAlertButton from '../../common/LastDataAddAlertButton';

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
  useUnitOverridesRevision();
  const latestSpeed = windSpeedData[windSpeedData.length - 1];
  const latestDirection = windDirectionData[windDirectionData.length - 1];
  const speedUnit = resolveAxisUnit('wind_speed', latestSpeed?.default_unit);
  const directionUnit = resolveAxisUnit(
    'wind_direction',
    latestDirection?.default_unit
  );

  // Background color with good contrast in light/dark mode
  const bgColor = useColorModeValue('green.100', 'green.800');

  // Text colors for readability
  const titleColor = useColorModeValue('green.900', 'green.300');
  const valueColor = useColorModeValue('gray.800', 'gray.200');
  const noDataColor = useColorModeValue('gray.600', 'gray.400');
  const timeColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box
      bg={bgColor}
      p={6}
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
      <WiStrongWind size={60} color={titleColor} />

      <Text fontWeight="bold" fontSize="lg" mt={3} color={titleColor}>
        Données récentes du vent
      </Text>

      {latestSpeed && latestDirection ? (
        <VStack spacing={2} mt={4}>
          <Text fontSize="lg" color={valueColor}>
            Vitesse du vent :{' '}
            {formatCalibratedReading('wind_speed', latestSpeed.value)}{' '}
            {speedUnit}
          </Text>
          <Text fontSize="lg" color={valueColor}>
            Direction du vent :{' '}
            {formatCalibratedReading('wind_direction', latestDirection.value)}{' '}
            {directionUnit}
          </Text>
        </VStack>
      ) : (
        <Text mt={4} fontSize="md" color={noDataColor}>
          Non disponible
        </Text>
      )}

      {latestSpeed && (
        <Text fontSize="sm" color={timeColor} mt={5}>
          Mise à jour : {timeAgo(latestSpeed.timestamp)}
        </Text>
      )}
      <LastDataAddAlertButton />
    </Box>
  );
};

export default WindRadarLastData;
