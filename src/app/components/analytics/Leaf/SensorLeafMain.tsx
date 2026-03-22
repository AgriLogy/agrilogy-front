import { Box, Stack, VStack } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import ChartDateRangeDragger from '../../common/ChartDateRangeDragger';
import ChartDateRangeGate from '../../common/ChartDateRangeGate';
import {
  filterByTimestampWindow,
  unionSortedTimestamps,
} from '@/app/utils/chartDateWindow';
import SensorLeafLastData from './SensorLeafLastData';
import SensorLeafChart from './SensorLeafChart';
import api from '@/app/lib/api';

type SensorData = {
  timestamp: string;
  value: number;
};

const SensorLeafMain = ({
  filters,
}: {
  filters: {
    startDate: string;
    endDate: string;
    selectedZone: number | null;
  };
}) => {
  const { startDate, endDate, selectedZone } = filters;
  const [moistureData, setMoistureData] = useState<SensorData[]>([]);
  const [temperatureData, setTemperatureData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moistureRes, temperatureRes] = await Promise.all([
          api.get('api/sensors/leafmoisture/', {
            params: {
              start_date: startDate,
              end_date: endDate,
              zone: selectedZone,
            },
          }),
          api.get('api/sensors/leaftemperature/', {
            params: {
              start_date: startDate,
              end_date: endDate,
              zone: selectedZone,
            },
          }),
        ]);

        setMoistureData(moistureRes.data);
        setTemperatureData(temperatureRes.data);
      } catch (err) {
        console.error('Error fetching leaf data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, selectedZone]);

  const timeline = useMemo(
    () => unionSortedTimestamps(moistureData, temperatureData),
    [moistureData, temperatureData]
  );

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing={2}
      width="100%"
      height="100%"
      maxH={"560px"}
    >
      <Box flex={3} p={3}>
        <ChartDateRangeGate timeline={timeline}>
          {({ startIdx, endIdx, setRange }) => (
            <VStack spacing={0} align="stretch" width="100%">
              <SensorLeafChart
                temperatureData={filterByTimestampWindow(
                  temperatureData,
                  timeline,
                  startIdx,
                  endIdx
                )}
                moistureData={filterByTimestampWindow(
                  moistureData,
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
      <Box flex={1} p={3} >
        <SensorLeafLastData
          temperature={temperatureData[temperatureData.length - 1]}
          moisture={moistureData[moistureData.length - 1]}
        />
      </Box>
    </Stack>
  );
};

export default SensorLeafMain;
