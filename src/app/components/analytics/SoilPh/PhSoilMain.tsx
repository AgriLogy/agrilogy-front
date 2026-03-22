import { Box, Stack, VStack } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import ChartDateRangeDragger from '../../common/ChartDateRangeDragger';
import ChartDateRangeGate from '../../common/ChartDateRangeGate';
import { SensorData } from '@/app/types';
import api from '@/app/lib/api';
import '@/app/styles/style.css';
import PhSoilChart from './PhSoilChart';
import PhSoilLastData from './PhSoilLastData';

const PhSoilMain = ({
  filters,
}: {
  filters: {
    startDate: string;
    endDate: string;
    selectedZone: number | null;
  };
}) => {
  const { startDate, endDate, selectedZone } = filters;
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<SensorData[]>('/api/sensors/phsoil/', {
        params: {
          start_date: startDate,
          end_date: endDate,
          zone: selectedZone,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to fetch electricity data:', err))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedZone]);

  const sortedData = useMemo(
    () => [...data].sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    [data]
  );
  const timeline = useMemo(
    () => sortedData.map((d) => d.timestamp),
    [sortedData]
  );
  return (
    <Stack
      spacing={2}
      direction={{ base: 'column', md: 'row' }}
      align="center"
      width="100%"
      height="100%"
      maxH="560px"
      className="Box"
    >
      <Box flex={3} p={2} height="100%" width="100%">
        <ChartDateRangeGate timeline={timeline}>
          {({ startIdx, endIdx, setRange }) => (
            <VStack spacing={0} align="stretch" width="100%">
              <PhSoilChart
                data={sortedData.slice(startIdx, endIdx + 1)}
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
        <PhSoilLastData data={data} />
      </Box>
    </Stack>
  );
};

export default PhSoilMain;
