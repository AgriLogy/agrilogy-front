import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { FaCloudRain } from 'react-icons/fa';
import { SensorData } from '@/app/types';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import {
  formatCalibratedReading,
  resolveAxisUnit,
} from '@/app/utils/unitOverrides';
import LastDataAddAlertButton from '../../common/LastDataAddAlertButton';

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

const CumulPrecipitationLastData = ({ data }: { data: SensorData[] }) => {
  const latest = data[data.length - 1];
  useUnitOverridesRevision();
  const unit = resolveAxisUnit('precipitation_rate', latest?.default_unit);

  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const valueColor = useColorModeValue('blue.700', 'blue.200');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const timeColor = useColorModeValue('gray.500', 'gray.400');

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
      <FaCloudRain size={50} color="#3b82f6" />
      <Text fontWeight="bold" fontSize="lg" mt={2} color={textColor}>
        Dernière précipitation :
      </Text>
      <Text fontSize="2xl" color={valueColor}>
        {latest
          ? `${formatCalibratedReading('precipitation_rate', latest.value)} ${unit}`
          : 'Non disponible'}
      </Text>
      <Text fontSize="sm" color={timeColor}>
        {latest ? `Mise à jour : ${timeAgo(latest.timestamp)}` : ''}
      </Text>
      <LastDataAddAlertButton />
    </Box>
  );
};

export default CumulPrecipitationLastData;
