'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import Loading from '@component/common/Loading';
import DashboardCard from '@component/dashboard/DashboardCard';

const FarmSectorsMap = dynamic(() => import('@component/FarmSectorsMap'), {
  ssr: false,
  loading: () => <Loading />,
});

export default function GoogleMapWeather() {
  const p = useBreakpointValue({ base: 2, md: 4 }) ?? 2;

  const [loading, setLoading] = useState(true);
  const lat = 32.88986;
  const lon = -6.914351;

  useEffect(() => {
    setLoading(false);
  }, []);

  const content = loading ? (
    <Loading />
  ) : (
    <Box width="100%" overflow="visible">
      <FarmSectorsMap lat={lat} lon={lon} />
    </Box>
  );

  return (
    <Box width="100%" height="100%" p={p} overflowX="auto">
      <DashboardCard
        title="Explorez les zones et les capteurs"
        content={content}
      />
    </Box>
  );
}
