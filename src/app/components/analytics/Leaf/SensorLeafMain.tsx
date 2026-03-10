import { Box, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
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

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      spacing={2}
      width="100%"
      height="100%"
    >
      <Box flex={3} p={3}>
        <SensorLeafChart
          temperatureData={temperatureData}
          moistureData={moistureData}
          loading={loading}
        />
      </Box>
      <Box flex={1} p={3}>
        <SensorLeafLastData
          temperature={temperatureData[temperatureData.length - 1]}
          moisture={moistureData[moistureData.length - 1]}
        />
      </Box>
    </Stack>
  );
};

export default SensorLeafMain;
