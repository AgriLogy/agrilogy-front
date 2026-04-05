import { Box, Text, VStack, HStack, useColorModeValue } from '@chakra-ui/react';
import { FaThermometerHalf } from 'react-icons/fa';
import { SensorData } from '@/app/types';
import {
  formatCalibratedReading,
  resolveAxisUnit,
} from '@/app/utils/unitOverrides';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import LastDataAddAlertButton from '../../common/LastDataAddAlertButton';

const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);

  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `${diffMin} min`;
  if (diffH < 24) return `${diffH} h`;
  return then.toLocaleDateString();
};

const Row = ({
  label,
  entry,
  color,
  sensorKey,
}: {
  label: string;
  entry?: SensorData;
  color: string;
  sensorKey: string;
}) => {
  const metaColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box pl={3} borderLeftWidth="3px" borderLeftColor={color}>
      <VStack align="stretch" spacing={0}>
        <HStack justify="space-between">
          <Text fontWeight="semibold" color={color}>
            {label}
          </Text>
          <Text color={color}>
            {entry
              ? `${formatCalibratedReading(sensorKey, entry.value)} ${resolveAxisUnit(sensorKey, entry.default_unit)}`
              : 'Non disponible'}
          </Text>
        </HStack>
        <Text fontSize="sm" color={metaColor}>
          {entry ? `Maj: ${timeAgo(entry.timestamp)}` : ''}
        </Text>
      </VStack>
    </Box>
  );
};

const SoilTemperatureLastData = ({
  lastLow,
  lastMedium,
  lastHigh,
}: {
  lastLow?: SensorData;
  lastMedium?: SensorData;
  lastHigh?: SensorData;
}) => {
  useUnitOverridesRevision();
  const bgColor = useColorModeValue('orange.50', 'orange.900');
  const headerColor = useColorModeValue('gray.700', 'gray.200');
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.300');
  const iconColor = useColorModeValue('orange.600', 'orange.300');

  // series colors (mode-aware)
  const lowColor = useColorModeValue('blue.600', 'blue.300');
  const medColor = useColorModeValue('teal.600', 'teal.300');
  const highColor = useColorModeValue('red.600', 'red.300');

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="md"
      boxShadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
      minH="300px"
      minW="250px"
      height="100%"
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="stretch"
    >
      <VStack spacing={4} align="stretch">
        <HStack justify="center">
          <FaThermometerHalf size={44} color={iconColor} />
        </HStack>
        <Text
          fontWeight="bold"
          fontSize="lg"
          color={headerColor}
          textAlign="center"
        >
          Dernières mesures
        </Text>
        <Row
          label="Basse (Low)"
          entry={lastLow}
          color={lowColor}
          sensorKey="soil_temp_low"
        />
        <Row
          label="Moyenne (Medium)"
          entry={lastMedium}
          color={medColor}
          sensorKey="soil_temp_medium"
        />
        <Row
          label="Haute (High)"
          entry={lastHigh}
          color={highColor}
          sensorKey="soil_temp_high"
        />
      </VStack>
      <LastDataAddAlertButton />
    </Box>
  );
};

export default SoilTemperatureLastData;
