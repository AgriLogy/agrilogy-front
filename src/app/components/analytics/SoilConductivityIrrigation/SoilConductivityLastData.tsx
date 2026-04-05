import { Box, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { SensorData } from '@/app/types';
import { FaWater } from 'react-icons/fa';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import {
  formatCalibratedReading,
  resolveAxisUnit,
} from '@/app/utils/unitOverrides';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import LastDataAddAlertButton from '../../common/LastDataAddAlertButton';

const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMin = Math.floor((now.getTime() - then.getTime()) / 60000);
  const diffH = Math.floor(diffMin / 60);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `${diffMin} min.`;
  if (diffH < 24) return `${diffH} heures`;
  return then.toLocaleDateString();
};

const SoilConductivityLastData = ({
  lowData,
  highData,
  flowData,
}: {
  lowData: SensorData[];
  highData: SensorData[];
  flowData: SensorData[];
}) => {
  useUnitOverridesRevision();
  const latestLow = lowData[lowData.length - 1];
  const latestHigh = highData[highData.length - 1];
  const latestFlow = flowData[flowData.length - 1];

  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const timeColor = useColorModeValue('gray.500', 'gray.400');
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
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <FaWater size={40} color="#00B0FF" /> {/* Bright blue water icon */}
      <Text fontWeight="bold" fontSize="lg" mt={2} color={textColor}>
        Derniers niveaux EC du sol & irrigation
      </Text>
      <VStack spacing={3} mt={4}>
        <Text fontSize="lg" color="#1E88E5">
          {' '}
          {/* Medium blue for low conductivity */}
          Profondeur basse :{' '}
          {latestLow
            ? `${formatCalibratedReading('soil_conductivity', latestLow.value)} ${resolveAxisUnit('soil_conductivity', latestLow.default_unit)}`
            : 'Non disponible'}
        </Text>
        <Text fontSize="lg" color="#2BB673">
          {' '}
          {/* Vibrant teal-green for high conductivity */}
          Profondeur haute :{' '}
          {latestHigh
            ? `${formatCalibratedReading('soil_conductivity', latestHigh.value)} ${resolveAxisUnit('soil_conductivity', latestHigh.default_unit)}`
            : 'Non disponible'}
        </Text>
        <Text fontSize="lg" color="#00B0FF">
          {' '}
          {/* Orange-red for irrigation flow */}
          Débit irrigation :{' '}
          {latestFlow
            ? `${formatCalibratedReading('water_flow', latestFlow.value)} ${resolveAxisUnit('water_flow', latestFlow.default_unit)}`
            : 'Non disponible'}
        </Text>
      </VStack>
      {(latestLow || latestHigh || latestFlow) && (
        <Text fontSize="sm" color={timeColor} mt={3}>
          Mise à jour :{' '}
          {timeAgo(
            latestFlow?.timestamp ||
              latestHigh?.timestamp ||
              latestLow?.timestamp ||
              ''
          )}
        </Text>
      )}
      <LastDataAddAlertButton />
    </Box>
  );
};

export default SoilConductivityLastData;
