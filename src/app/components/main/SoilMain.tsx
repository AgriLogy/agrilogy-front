import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import s from '@/app/styles/style.module.css';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import api from '@/app/lib/api';
import getActiveGraphs, {
  ActiveGraphResponse,
} from '@/app/utils/getActiveGraphs';

// Soil-specific components
import WaterSoilMain from '../analytics/SoilWater/WaterSoilMain';
import PhSoilMain from '../analytics/SoilPh/PhSoilMain';
import SoilSalinityConductivityMain from '../analytics/SoilSalinityConductivity/SoilSalinityConductivityMain';
import SoilConductivityIrrigationMain from '../analytics/SoilConductivityIrrigation/SoilConductivityIrrigationMain';
import NpkMain from '../analytics/npk/NpkMain';
import SoilTemperatureMain from '../analytics/SoilTemperature/SoilTemperatureMain';
import DashboardHeader from './DashboardHeader';

const SoilMain = () => {
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
        label="Données sur le sol"
        zones={zones}
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      {activeGraph?.soil_irrigation_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <WaterSoilMain filters={filters} />
        </Box>
      )}
      {activeGraph?.soil_temperature_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <SoilTemperatureMain filters={filters} />
        </Box>
      )}
      {activeGraph?.soil_ph_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <PhSoilMain filters={filters} />
        </Box>
      )}

      {activeGraph?.soil_conductivity_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <SoilSalinityConductivityMain filters={filters} />
        </Box>
      )}
      {activeGraph?.soil_moisture_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <SoilConductivityIrrigationMain filters={filters} />
        </Box>
      )}
      {activeGraph?.npk_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <NpkMain filters={filters} />
        </Box>
      )}
    </div>
  );
};

export default SoilMain;
