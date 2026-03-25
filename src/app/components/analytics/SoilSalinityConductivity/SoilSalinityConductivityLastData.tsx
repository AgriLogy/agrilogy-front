import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { FaTint, FaRulerCombined } from 'react-icons/fa';
import { SensorData } from '@/app/types';
import { formatNumber } from '@/app/utils/formatNumber';

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

const SoilSalinityConductivityLastData = ({
  salinityData,
  conductivityData,
}: {
  salinityData: SensorData[];
  conductivityData: SensorData[];
}) => {
  const latestSalinity = salinityData[salinityData.length - 1];
  const latestConductivity = conductivityData[conductivityData.length - 1];

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
      <Box textAlign="center">
        <Box display="flex" justifyContent="center">
          <FaTint size={50} color="#2b6cb0" />
        </Box>
        <Text fontWeight="bold" fontSize="lg" mt={2} color={textColor}>
          Dernière salinité :
        </Text>
        <Text fontSize="2xl" color={valueColor}>
          {latestSalinity
            ? `${formatNumber(latestSalinity.value)} mg/l`
            : 'N/A'}
        </Text>
        <Text fontSize="sm" color={textColor}>
          {latestSalinity
            ? `Mise à jour : ${timeAgo(latestSalinity.timestamp)}`
            : ''}
        </Text>
      </Box>

      <Box textAlign="center" mt={6}>
        <Box display="flex" justifyContent="center">
          <FaRulerCombined size={40} color="#48bb78" />
        </Box>
        <Text fontWeight="bold" fontSize="lg" mt={2} color={textColor}>
          Dernière conductivité :
        </Text>
        <Text fontSize="2xl" color={valueColor}>
          {latestConductivity
            ? `${formatNumber(latestConductivity.value)} μS/cm`
            : 'N/A'}
        </Text>
        <Text fontSize="sm" color={textColor}>
          {latestConductivity
            ? `Mise à jour : ${timeAgo(latestConductivity.timestamp)}`
            : ''}
        </Text>
      </Box>
    </Box>
  );
};

export default SoilSalinityConductivityLastData;
