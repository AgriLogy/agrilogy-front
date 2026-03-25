import { Box, Stack, VStack } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import ChartDateRangeDragger from '../../common/ChartDateRangeDragger';
import ChartDateRangeGate from '../../common/ChartDateRangeGate';
import {
  filterByTimestampWindow,
  unionSortedTimestamps,
} from '@/app/utils/chartDateWindow';
import { SensorData } from '@/app/types';

import SoilSalinityConductivityLastData from './SoilSalinityConductivityLastData';
import SoilSalinityConductivityChart from './SoilSalinityConductivityChart';

import '@/app/styles/style.css';
import api from '@/app/lib/api';

const SoilSalinityConductivityMain = ({
  filters,
}: {
  filters: {
    startDate: string;
    endDate: string;
    selectedZone: number | null;
    // Add more fields here as needed in the future
  };
}) => {
  const { startDate, endDate, selectedZone } = filters;
  const [Salinitydata, setSalinityData] = useState<SensorData[]>([]);
  const [Conductivitydata, setConductivityData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<SensorData[]>('/api/sensors/soilsalinity/', {
        params: {
          start_date: startDate,
          end_date: endDate,
          zone: selectedZone,
        },
      })
      .then((res) => setSalinityData(res.data))
      .catch((err) => console.error('Failed to fetch fruit size data:', err))
      .finally(() => setLoading(false));

    api
      .get<SensorData[]>('/api/sensors/soilconductivity/', {
        params: {
          start_date: startDate,
          end_date: endDate,
          zone: selectedZone,
        },
      })
      .then((res) => setConductivityData(res.data))
      .catch((err) => console.error('Failed to fetch fruit size data:', err))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedZone]);

  const timeline = useMemo(
    () => unionSortedTimestamps(Salinitydata, Conductivitydata),
    [Salinitydata, Conductivitydata]
  );

  return (
    <Stack
      spacing={2}
      direction={{ base: 'column', md: 'row' }}
      align="start"
      width="100%"
      height="100%"
      maxH={"560px"}
      className="Box"
    >
      <Box flex={3} p={2} height={'100%'} width={'100%'}>
        <ChartDateRangeGate timeline={timeline}>
          {({ startIdx, endIdx, setRange }) => (
            <VStack spacing={0} align="stretch" width="100%">
              <SoilSalinityConductivityChart
                salinityData={filterByTimestampWindow(
                  Salinitydata,
                  timeline,
                  startIdx,
                  endIdx
                )}
                conductivityData={filterByTimestampWindow(
                  Conductivitydata,
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
      <Box flex={1} p={3} height={'100%'} width={'100%'}>
        {/* <SoilSalinityConductivityLastData data={data} /> */}
        <SoilSalinityConductivityLastData
          salinityData={Salinitydata}
          conductivityData={Conductivitydata}
        />
      </Box>
    </Stack>
  );
};

export default SoilSalinityConductivityMain;
