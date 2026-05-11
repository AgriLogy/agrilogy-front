import { Box, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { WiHumidity, WiThermometer } from 'react-icons/wi';
import {
  formatCalibratedReading,
  resolveAxisUnit,
} from '@/app/utils/unitOverrides';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import LastDataAddAlertButton from '../../common/LastDataAddAlertButton';
import LastDataPanel from '../../common/LastDataPanel';

interface WeatherData {
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

const TempuratureHumidtyLastData = ({
  humidityData,
  temperatureData,
}: {
  humidityData: WeatherData[];
  temperatureData: WeatherData[];
}) => {
  useUnitOverridesRevision();
  const latestHumidity = humidityData[humidityData.length - 1];
  const latestTemperature = temperatureData[temperatureData.length - 1];
  const temperatureUnit = resolveAxisUnit(
    'temperature_weather',
    latestTemperature?.default_unit
  );
  const humidityUnit = resolveAxisUnit(
    'humidity_weather',
    latestHumidity?.default_unit
  );

  const textColor = useColorModeValue('gray.700', 'gray.200');
  const muted = useColorModeValue('gray.600', 'gray.400');
  const timeColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box
      flex={1}
      minH={0}
      minW={0}
      w="100%"
      alignSelf="stretch"
      display="flex"
      flexDirection="column"
    >
      <LastDataPanel
        variant="tempHumidity"
        display="flex"
        flexDirection="column"
        textAlign="center"
        minW="250px"
      >
        <Text
          fontSize="xs"
          fontWeight="semibold"
          letterSpacing="0.08em"
          textTransform="uppercase"
          color={muted}
          mb={3}
        >
          {`Air — ${temperatureUnit} · ${humidityUnit}`}
        </Text>

        <VStack spacing={4}>
          {latestTemperature ? (
            <Box>
              <WiThermometer
                size={32}
                style={{ display: 'inline', color: '#dd6b20' }}
              />
              <Text fontSize="xs" color={muted} mt={1}>
                Température
              </Text>
              <Text fontSize="xl" fontWeight="semibold" color={textColor}>
                {`${formatCalibratedReading('temperature_weather', latestTemperature.value)} ${temperatureUnit}`}
              </Text>
            </Box>
          ) : (
            <Text color={muted}>Température : —</Text>
          )}

          {latestHumidity ? (
            <Box>
              <WiHumidity
                size={32}
                style={{ display: 'inline', color: '#1f7740' }}
              />
              <Text fontSize="xs" color={muted} mt={1}>
                Humidité relative
              </Text>
              <Text fontSize="xl" fontWeight="semibold" color={textColor}>
                {`${formatCalibratedReading('humidity_weather', latestHumidity.value)} ${humidityUnit}`}
              </Text>
            </Box>
          ) : (
            <Text color={muted}>Humidité : —</Text>
          )}

          {latestTemperature && (
            <Text fontSize="xs" color={timeColor}>
              Mesure : {timeAgo(latestTemperature.timestamp)}
            </Text>
          )}
        </VStack>
        <LastDataAddAlertButton sensorKey="temperature_weather" />
      </LastDataPanel>
    </Box>
  );
};

export default TempuratureHumidtyLastData;
