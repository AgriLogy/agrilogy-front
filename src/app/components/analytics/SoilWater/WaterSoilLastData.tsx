import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { GiWaterDrop, GiWaterTank, GiGroundbreaker } from 'react-icons/gi';
import { FaTachometerAlt } from 'react-icons/fa';
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

const SensorBox = ({
  icon,
  label,
  data,
}: {
  icon: JSX.Element;
  label: string;
  data?: SensorData;
  color: string;
}) => {
  const valueColor = useColorModeValue('blue.700', 'blue.200');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const timeColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box textAlign="center" mb={6}>
      <Box display="flex" justifyContent="center">
        {icon}
      </Box>
      <Text fontWeight="bold" fontSize="lg" mt={2} color={textColor}>
        {label}
      </Text>
      <Text fontSize="2xl" color={valueColor}>
        {data ? `${formatNumber(data.value)} ${data.default_unit}` : 'N/A'}
      </Text>
      <Text fontSize="sm" color={timeColor}>
        {data ? `Mise à jour : ${timeAgo(data.timestamp)}` : ''}
      </Text>
    </Box>
  );
};

const WaterSoilLastData = ({
  soilLow,
  soilMedium,
  soilHigh,
  waterFlow,
}: {
  soilLow?: SensorData;
  soilMedium?: SensorData;
  soilHigh?: SensorData;
  waterFlow?: SensorData;
}) => {
  const bgColor = useColorModeValue('blue.50', 'blue.900');

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
      // justifyContent="center"
      alignItems="center"
      textAlign="center"
      overflowY="auto" // Enable vertical overflow scrolling
    >
      {/* Soil - Low */}
      {soilLow && (
        <SensorBox
          icon={<GiGroundbreaker size={40} color="#9c6644" />}
          label="Humidité du Sol - Bas"
          data={soilLow}
          color="#9c6644"
        />
      )}

      {/* Soil - Medium */}
      {soilMedium && (
        <SensorBox
          icon={<GiWaterDrop size={40} color="#2b6cb0" />}
          label="Humidité du Sol - Moyen"
          data={soilMedium}
          color="#2b6cb0"
        />
      )}

      {/* Soil - High */}
      {soilHigh && (
        <SensorBox
          icon={<GiWaterTank size={40} color="#38a169" />}
          label="Humidité du Sol - Haut"
          data={soilHigh}
          color="#38a169"
        />
      )}

      {/* Water Flow */}
      {waterFlow && (
        <SensorBox
          icon={<FaTachometerAlt size={40} color="#e53e3e" />}
          label="Irrigation"
          data={waterFlow}
          color="#e53e3e"
        />
      )}
    </Box>
  );
};

export default WaterSoilLastData;
