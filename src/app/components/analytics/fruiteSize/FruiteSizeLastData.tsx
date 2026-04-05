import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import {
  formatCalibratedReading,
  resolveAxisUnit,
} from '@/app/utils/unitOverrides';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import { FaAppleAlt } from 'react-icons/fa';
import { SensorData } from '@/app/types';
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

const FruiteSizeLastData = ({ data }: { data: SensorData[] }) => {
  const latest = data[data.length - 1];
  useUnitOverridesRevision();

  // Dynamic colors for light/dark modes
  const bgColor = useColorModeValue('green.100', 'green.900');
  const valueColor = useColorModeValue('green.700', 'green.200');
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
      <FaAppleAlt size={50} color="#d1495b" />
      <Text fontWeight="bold" fontSize="lg" mt={2} color={textColor}>
        Dernière taille mesurée :
      </Text>
      <Text fontSize="2xl" color={valueColor}>
        {latest
          ? `${formatCalibratedReading('fruit_size', latest.value)} ${resolveAxisUnit('fruit_size', latest?.default_unit)}`
          : 'Non disponible'}
      </Text>
      <Text fontSize="sm" color={textColor}>
        {latest ? `Mise à jour : ${timeAgo(latest.timestamp)}` : ''}
      </Text>
      <LastDataAddAlertButton />
    </Box>
  );
};

export default FruiteSizeLastData;
