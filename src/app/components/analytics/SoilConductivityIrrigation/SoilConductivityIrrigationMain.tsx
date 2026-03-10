import { Box, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import SoilConductivityLastData from './SoilConductivityLastData';
import SoilConductivityChart from './SoilConductivityChart';
import { SensorData } from '@/app/types';

const SoilConductivityMain = ({
  filters,
}: {
  filters: {
    startDate: string;
    endDate: string;
    selectedZone: number | null;
  };
}) => {
  const { startDate, endDate, selectedZone } = filters;
  const [lowData, setLowData] = useState<SensorData[]>([]);
  const [highData, setHighData] = useState<SensorData[]>([]);
  const [flowData, setFlowData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const params = {
      start_date: startDate,
      end_date: endDate,
      zone: selectedZone,
    };

    Promise.all([
      api.get<SensorData[]>('/api/sensors/ecsoillow/', { params }),
      api.get<SensorData[]>('/api/sensors/ecsoilhigh/', { params }),
      api.get<SensorData[]>('/api/sensors/waterflow/', { params }),
    ])
      .then(([lowRes, highRes, flowRes]) => {
        setLowData(lowRes.data);
        setHighData(highRes.data);
        setFlowData(flowRes.data);
      })
      .catch((err) => console.error('Soil conductivity fetch error:', err))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedZone]);

  return (
    <Stack
      spacing={2}
      direction={{ base: 'column', md: 'row' }}
      align="start"
      width="100%"
      height="100%"
    >
      <Box flex={3} p={2} height="100%" width="100%">
        <SoilConductivityChart
          lowData={lowData}
          highData={highData}
          flowData={flowData}
          loading={loading}
        />
      </Box>
      <Box flex={1} p={3} height="100%" width="100%">
        <SoilConductivityLastData
          lowData={lowData}
          highData={highData}
          flowData={flowData}
        />
      </Box>
    </Stack>
  );
};

export default SoilConductivityMain;
