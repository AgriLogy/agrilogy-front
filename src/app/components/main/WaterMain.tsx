'use client';
import React, { useEffect, useState } from 'react';
import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';

import useColorModeStyles from '@/app/utils/useColorModeStyles';
import DateRangePicker from '../analytics/DateRangePicker';
import api from '@/app/lib/api';
import getActiveGraphs, {
  ActiveGraphResponse,
} from '@/app/utils/getActiveGraphs';

import s from '@/app/styles/style.module.css';
import CumulPrecipitationMain from '../analytics/CumulPrecipitation/CumulPrecipitationMain';
import EcWaterMain from '../analytics/WaterEc/EcWaterMain';
import WaterFlowMain from '../analytics/WaterFlow/WaterFlowMain';
import PhWaterMain from '../analytics/WaterPh/PhWaterMain';
import WaterPressureMain from '../analytics/WaterPressure/WaterPressureMain';
import ZoneNotificationBell from '@/app/components/common/ZoneNotificationBell';

const WaterMain = () => {
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [activeGraph, setActiveGraph] = useState<ActiveGraphResponse | null>(
    null
  );

  const { bg, textColor } = useColorModeStyles();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const filters = { startDate, endDate, selectedZone };

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await api.get('/api/zones-names-per-user/');
        setZones(res.data || []);
        if (res.data.length > 0) setSelectedZone(res.data[0].id);
      } catch (error) {
        console.error('Failed to fetch zones', error);
      }
    };
    fetchZones();
  }, []);

  useEffect(() => {
    if (selectedZone !== null) {
      getActiveGraphs(selectedZone).then(setActiveGraph);
    }
  }, [selectedZone]);

  return (
    <div className={s.container}>
      <Box bg={bg} className={s.header} border="1px">
        <HStack spacing={3} flexWrap="wrap" alignItems="center">
          <Text color={textColor}>Données sur l&apos;eau du </Text>
          <select
            value={selectedZone ?? ''}
            onChange={(e) => setSelectedZone(Number(e.target.value))}
            style={{
              borderRadius: '2px',
              padding: '4px',
              color: useColorModeValue('black', 'white'),
              backgroundColor: useColorModeValue('white', '#2D3748'),
              border: `1px solid ${useColorModeValue('black', 'white')}`,
            }}
          >
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
          {selectedZone != null && (
            <ZoneNotificationBell
              zoneId={selectedZone}
              zoneName={
                zones.find((z) => z.id === selectedZone)?.name ?? 'Zone'
              }
            />
          )}
        </HStack>
      </Box>

      <Box bg={bg} className={s.header} border="1px" mt={0} mb={0}>
        <DateRangePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          zones={zones}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
        />
      </Box>

      {activeGraph?.water_flow_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <WaterFlowMain filters={filters} />
        </Box>
      )}
      {activeGraph?.water_pressure_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <WaterPressureMain filters={filters} />
        </Box>
      )}
      {activeGraph?.water_ph_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <PhWaterMain filters={filters} />
        </Box>
      )}
      {activeGraph?.water_ec_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <EcWaterMain filters={filters} />
        </Box>
      )}
      {activeGraph?.cumulative_precipitation_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <CumulPrecipitationMain filters={filters} />
        </Box>
      )}
    </div>
  );
};

export default WaterMain;
