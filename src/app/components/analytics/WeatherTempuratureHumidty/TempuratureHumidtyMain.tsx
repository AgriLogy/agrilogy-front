import { Box, Stack, VStack } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import ChartDateRangeDragger from '../../common/ChartDateRangeDragger';
import ChartDateRangeGate from '../../common/ChartDateRangeGate';
import {
  filterByTimestampWindow,
  unionSortedTimestamps,
} from '@/app/utils/chartDateWindow';
import api from '@/app/lib/api';
import TempuratureHumidtyChart from './TempuratureHumidtyChart';
import TempuratureHumidtyLastData from './TempuratureHumidtyLastData';

interface WeatherData {
  id: number;
  timestamp: string;
  default_unit: string;
  available_units: string[];
  value: number;
  zone: number;
  user: number;
}

const TempuratureHumidtyMain = ({
  filters,
}: {
  filters: {
    startDate: string;
    endDate: string;
    selectedZone: number | null;
  };
}) => {
  const { startDate, endDate, selectedZone } = filters;
  const [humidityData, setHumidityData] = useState<WeatherData[]>([]);
  const [temperatureData, setTemperatureData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHumidity = api.get<WeatherData[]>(
      '/api/sensors/humidityweather/',
      {
        params: {
          start_date: startDate,
          end_date: endDate,
          zone: selectedZone,
        },
      }
    );

    const fetchTemperature = api.get<WeatherData[]>(
      '/api/sensors/temperatureweather/',
      {
        params: {
          start_date: startDate,
          end_date: endDate,
          zone: selectedZone,
        },
      }
    );

    Promise.all([fetchHumidity, fetchTemperature])
      .then(([humRes, tempRes]) => {
        setHumidityData(humRes.data);
        setTemperatureData(tempRes.data);
      })
      .catch((err) => console.error('Error fetching weather data:', err))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedZone]);

  const timeline = useMemo(
    () => unionSortedTimestamps(humidityData, temperatureData),
    [humidityData, temperatureData]
  );

  return (
    <Stack
      spacing={2}
      direction={{ base: 'column', md: 'row' }}
      align="start"
      width="100%"
      height="100%"
      maxH="560px"
      className="Box"
    >
      <Box flex={3} p={2} height="100%" width="100%">
        <ChartDateRangeGate timeline={timeline}>
          {({ startIdx, endIdx, setRange }) => (
            <VStack spacing={0} align="stretch" width="100%">
              <TempuratureHumidtyChart
                humidityData={filterByTimestampWindow(
                  humidityData,
                  timeline,
                  startIdx,
                  endIdx
                )}
                temperatureData={filterByTimestampWindow(
                  temperatureData,
                  timeline,
                  startIdx,
                  endIdx
                )}
                loading={loading}
              />
              <ChartDateRangeDragger
                timestamps={timeline}
                startIdx={startIdx}
                endIdx={endIdx}
                onChange={(r) => setRange(r)}
              />
            </VStack>
          )}
        </ChartDateRangeGate>
      </Box>
      <Box flex={1} p={3} height="100%" width="100%">
        <TempuratureHumidtyLastData
          humidityData={humidityData}
          temperatureData={temperatureData}
        />
      </Box>
    </Stack>
  );
};

export default TempuratureHumidtyMain;
