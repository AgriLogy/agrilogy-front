'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import Loading from '@component/common/Loading';
import DashboardCard from '@component/dashboard/DashboardCard';

// Import the map only in the browser (prevents SSR "window is not defined")
const OpenStreetMap = dynamic(() => import('@component/OpenStreetMap'), {
  ssr: false,
  loading: () => <Loading />,
});

export default function GoogleMapWeather() {
  // Chakra can use matchMedia under the hood; this runs only on client due to "use client"
  const p = useBreakpointValue({ base: 2, md: 4 }) ?? 2;

  const [loading, setLoading] = useState(true);
  const lat = 32.88986;
  const lon = -6.914351;

  useEffect(() => {
    // simulate initial load; remove if unnecessary
    setLoading(false);
  }, []);

  const content = loading ? (
    <Loading />
  ) : (
    <Box
      width="100%"
      height={{ base: '300px', md: '400px' }}
      minH={{ base: '280px', md: '360px' }}
      maxH={{ base: '300px', md: '500px' }}
      borderRadius="md"
      overflow="hidden"
    >
      <OpenStreetMap lat={lat} lon={lon} />
    </Box>
  );

  return (
    <Box width="100%" height="100%" p={p} overflowX="auto">
      <DashboardCard title="Localisation" content={content} />
    </Box>
  );
}
