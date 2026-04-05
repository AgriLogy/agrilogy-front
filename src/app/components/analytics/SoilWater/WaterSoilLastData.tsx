import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { GiWaterDrop, GiWaterTank, GiGroundbreaker } from 'react-icons/gi';
import { FaTachometerAlt } from 'react-icons/fa';
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
  if (diffMin < 60) return `${diffMin} min.`;
  if (diffH < 24) return `${diffH} heures`;
  return then.toLocaleDateString();
};

const SensorBox = ({
  icon,
  label,
  data,
  sensorKey,
}: {
  icon: JSX.Element;
  label: string;
  data?: SensorData;
  sensorKey: string;
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
        {data
          ? `${formatCalibratedReading(sensorKey, data.value)} ${resolveAxisUnit(sensorKey, data.default_unit)}`
          : 'Non disponible'}
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
  useUnitOverridesRevision();
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
          sensorKey="soil_moisture_low"
          color="#9c6644"
        />
      )}

      {/* Soil - Medium */}
      {soilMedium && (
        <SensorBox
          icon={<GiWaterDrop size={40} color="#2b6cb0" />}
          label="Humidité du Sol - Moyen"
          data={soilMedium}
          sensorKey="soil_moisture_medium"
          color="#2b6cb0"
        />
      )}

      {/* Soil - High */}
      {soilHigh && (
        <SensorBox
          icon={<GiWaterTank size={40} color="#38a169" />}
          label="Humidité du Sol - Haut"
          data={soilHigh}
          sensorKey="soil_moisture_high"
          color="#38a169"
        />
      )}

      {/* Water Flow */}
      {waterFlow && (
        <SensorBox
          icon={<FaTachometerAlt size={40} color="#e53e3e" />}
          label="Irrigation"
          data={waterFlow}
          sensorKey="water_flow"
          color="#e53e3e"
        />
      )}
      <LastDataAddAlertButton />
    </Box>
  );
};

export default WaterSoilLastData;
