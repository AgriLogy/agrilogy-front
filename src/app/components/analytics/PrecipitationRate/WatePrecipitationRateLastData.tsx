import { Box, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FaCloudShowersHeavy } from 'react-icons/fa';
import { SensorData } from '@/app/types';
import { getUnitOverride } from '@/app/utils/unitOverrides';

const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffH < 24) return `${diffH} hours ago`;
  return then.toLocaleDateString();
};

const PrecipitationRateLastData = ({ data }: { data: SensorData[] }) => {
  const latest = data[data.length - 1];
  const unit = getUnitOverride('precipitation_rate', latest?.default_unit);

  // Light/Dark mode values
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const valueColor = useColorModeValue('blue.700', 'blue.200');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const { colorMode } = useColorMode();

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
      <FaCloudShowersHeavy
        size={50}
        fill={colorMode === 'dark' ? '#60a5fa' : '#3b82f6'}
      />
      <Text fontWeight="bold" fontSize="lg" mt={2} color={textColor}>
        Dernière consommation :
      </Text>
      <Text fontSize="2xl" color={valueColor}>
        {latest ? `${latest.value.toFixed(2)} ${unit}` : 'N/A'}
      </Text>
      <Text fontSize="sm" color={textColor}>
        {latest ? `Mise à jour : ${timeAgo(latest.timestamp)}` : ''}
      </Text>
    </Box>
  );
};

export default PrecipitationRateLastData;
