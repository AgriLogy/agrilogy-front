import { Box, Stack, VStack } from '@chakra-ui/react';
import ChartDateRangeDragger from '../../common/ChartDateRangeDragger';
import ChartDateRangeGate from '../../common/ChartDateRangeGate';
import { sortByTimestamp } from '@/app/utils/chartDateWindow';
import { useEffect, useMemo, useState } from 'react';
import api from '@/app/lib/api';
import { logOptionalApiFailure } from '@/app/utils/apiClientErrors';
import { calculateVPD } from '@/app/utils/calculateVPD';
import VPDChart, { type VPDDataPoint } from './VPDChart';
import VPDLastData from './VPDLastData';

interface WeatherData {
  id: number;
  timestamp: string;
  default_unit: string;
  available_units: string[];
  value: number;
  zone: number;
  user: number;
}

const VPDMain = ({
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
      .catch((err) =>
        logOptionalApiFailure('VPDMain: fetch humidity/temperature', err)
      )
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedZone]);

  const series = useMemo((): VPDDataPoint[] => {
    const tempMap = new Map<string, number>(
      temperatureData.map((t) => [t.timestamp, t.value])
    );
    const rows = humidityData
      .map((h) => {
        const temp = tempMap.get(h.timestamp);
        if (temp == null || Number.isNaN(temp)) return null;
        const vpd = calculateVPD(temp, h.value);
        return { timestamp: h.timestamp, vpd };
      })
      .filter((d): d is VPDDataPoint => d != null);
    return sortByTimestamp(rows);
  }, [humidityData, temperatureData]);

  const timeline = useMemo(() => series.map((d) => d.timestamp), [series]);

  return (
    <Stack
      spacing={2}
      direction={{ base: 'column', md: 'row' }}
      align="start"
      width="100%"
      height="100%"
      className="Box"
      maxH={'560px'}
    >
      <Box flex={3} p={2} height="100%" width="100%">
        <ChartDateRangeGate timeline={timeline}>
          {({ startIdx, endIdx, setRange }) => (
            <VStack spacing={0} align="stretch" width="100%">
              <VPDChart
                data={series.slice(startIdx, endIdx + 1)}
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
        <VPDLastData data={series} />
      </Box>
    </Stack>
  );
};

export default VPDMain;
