import { Box, Stack, VStack } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import ChartDateRangeDragger from '../../common/ChartDateRangeDragger';
import ChartDateRangeGate from '../../common/ChartDateRangeGate';
import { sortByTimestamp } from '@/app/utils/chartDateWindow';
import { SensorData } from '@/app/types';
import api from '@/app/lib/api';
import { logOptionalApiFailure } from '@/app/utils/apiClientErrors';
import {
  fetchWindGustRows,
  mergeGustIntoSpeedRows,
  type WindSpeedSensorRow,
} from '@/app/utils/windSpeedMerge';
import '@/app/styles/style.css';
import WindSpeedChart from './WindSpeedChart';
import WindSpeedLastData from './WindSpeedLastData';

const WindSpeedMain = ({
  filters,
}: {
  filters: {
    startDate: string;
    endDate: string;
    selectedZone: number | null;
  };
}) => {
  const { startDate, endDate, selectedZone } = filters;
  const [data, setData] = useState<WindSpeedSensorRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = {
      start_date: startDate,
      end_date: endDate,
      zone: selectedZone,
    };
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const [speedRes, gustRows] = await Promise.all([
          api.get<SensorData[]>('/api/sensors/windspeed/', { params }),
          fetchWindGustRows(params),
        ]);
        if (cancelled) return;
        const merged = mergeGustIntoSpeedRows(speedRes.data ?? [], gustRows);
        setData(merged);
      } catch (error) {
        logOptionalApiFailure('WindSpeedMain: windspeed', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [startDate, endDate, selectedZone]);

  const sortedData = useMemo(() => sortByTimestamp(data), [data]);
  const timeline = useMemo(
    () => sortedData.map((d) => d.timestamp),
    [sortedData]
  );

  return (
    <Stack
      spacing={2}
      direction={{ base: 'column', md: 'row' }}
      align="start"
      width="100%"
      height="100%"
      className="Box"
      maxH={'550px'}
    >
      <Box flex={3} p={2} height="100%" width="100%">
        <ChartDateRangeGate timeline={timeline}>
          {({ startIdx, endIdx, setRange }) => (
            <VStack spacing={0} align="stretch" width="100%">
              <WindSpeedChart
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
        <WindSpeedLastData data={data} />
      </Box>
    </Stack>
  );
};

export default WindSpeedMain;
