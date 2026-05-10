'use client';
import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';

import useColorModeStyles from '@/app/utils/useColorModeStyles';
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
import DashboardHeader from './DashboardHeader';

const WaterMain = () => {
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [activeGraph, setActiveGraph] = useState<ActiveGraphResponse | null>(
    null
  );

  const { bg } = useColorModeStyles();
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
      <DashboardHeader
        label="Données sur l'eau"
        zones={zones}
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

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
