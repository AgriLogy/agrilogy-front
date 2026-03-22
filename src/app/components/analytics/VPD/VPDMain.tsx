import { Box, Stack, VStack } from '@chakra-ui/react';
import ChartDateRangeDragger from '../../common/ChartDateRangeDragger';
import ChartDateRangeGate from '../../common/ChartDateRangeGate';
import { sortByTimestamp } from '@/app/utils/chartDateWindow';
import { useEffect, useMemo, useState } from 'react';
import api from '@/app/lib/api';
import { calculateVPD } from '@/app/utils/calculateVPD';
import VPDChart, { VPDDataPoint } from './VPDChart';
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
      .catch((err) => console.error('Error fetching data for VPD:', err))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedZone]);

  const vpdData: VPDDataPoint[] = useMemo(() => {
    return humidityData
      .map((h) => {
        const tempEntry = temperatureData.find(
          (t) => t.timestamp === h.timestamp
        );
        const temp = tempEntry?.value;
        if (temp == null || Number.isNaN(temp)) return null;
        const vpd = calculateVPD(temp, h.value);
        return { timestamp: h.timestamp, vpd };
      })
      .filter((d): d is VPDDataPoint => d != null);
  }, [humidityData, temperatureData]);

  const sortedVpd = useMemo(() => sortByTimestamp(vpdData), [vpdData]);
  const timeline = useMemo(
    () => sortedVpd.map((d) => d.timestamp),
    [sortedVpd]
  );

  return (
    <Stack
      spacing={2}
      direction={{ base: 'column', md: 'row' }}
      align="start"
      width="100%"
      height="100%"
      className="Box"
    >
      <Box flex={3} p={2} height="100%" width="100%">
        <ChartDateRangeGate timeline={timeline}>
          {({ startIdx, endIdx, setRange }) => (
            <VStack spacing={0} align="stretch" width="100%">
              <VPDChart
                data={sortedVpd.slice(startIdx, endIdx + 1)}
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
        <VPDLastData data={vpdData} />
      </Box>
    </Stack>
  );
};

export default VPDMain;
