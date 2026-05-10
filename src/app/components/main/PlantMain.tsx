'use client';
import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';

import useColorModeStyles from '@/app/utils/useColorModeStyles';
import api from '@/app/lib/api';
import { logOptionalApiFailure } from '@/app/utils/apiClientErrors';
import s from '@/app/styles/style.module.css';

import getActiveGraphs, {
  ActiveGraphResponse,
} from '@/app/utils/getActiveGraphs';

import FruiteSizeMain from '../analytics/fruiteSize/FruiteSizeMain';
import LargeFruitDiameterMain from '../analytics/LargeFruitDiameter/LargeFruitDiameterMain';
import SensorLeafMain from '../analytics/Leaf/SensorLeafMain';
import DashboardHeader from './DashboardHeader';

const PlantMain = () => {
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
        logOptionalApiFailure('PlantMain: zones', error);
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
        label="Données des plantes"
        zones={zones}
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      {/* Conditionally render graphs based on activeGraph */}
      {activeGraph?.fruit_size_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <FruiteSizeMain filters={filters} />
        </Box>
      )}
      {activeGraph?.large_fruit_diameter_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <LargeFruitDiameterMain filters={filters} />
        </Box>
      )}
      {activeGraph?.leaf_sensor_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <SensorLeafMain filters={filters} />
        </Box>
      )}
      {/* {activeGraph?.npk_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <NpkMain filters={filters} />
        </Box>
      )}
      {activeGraph?.electricity_consumption_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <ElectricityconsumptionMain filters={filters} />
        </Box>
      )} */}
      {/* {activeGraph?.water_flow_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <WaterFlowMain filters={filters} />
        </Box>
      )} */}
      {/* {activeGraph?.water_pressure_status && (
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
      )} */}
    </div>
  );
};

export default PlantMain;
