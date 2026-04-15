'use client';
import React, { useEffect, useState } from 'react';
import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';

import useColorModeStyles from '@/app/utils/useColorModeStyles';
import api from '@/app/lib/api';
import s from '@/app/styles/style.module.css';

import DateRangePicker from '../analytics/DateRangePicker';
import getActiveGraphs, {
  ActiveGraphResponse,
} from '@/app/utils/getActiveGraphs';

// Weather station components
import TempuratureHumidtyMain from '../analytics/WeatherTempuratureHumidty/TempuratureHumidtyMain';
import WindSpeedMain from '../analytics/WindSpeed/WindSpeedMain';
import WindRadarMain from '../analytics/Wind/WindRadarMain';
import ET0Main from '../analytics/ET0/ET0Main';
import SolarRadiationMain from '../analytics/SolarRadiation/SolarRadiationMain';
import CumulPrecipitationMain from '../analytics/CumulPrecipitation/CumulPrecipitationMain';
import PrecipitationRateMain from '../analytics/PrecipitationRate/PrecipitationRateMain';
import VPDMain from '../analytics/VPD/VPDMain';
import ZoneNotificationBell from '@/app/components/common/ZoneNotificationBell';

const StationMain = () => {
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
      <Box bg={bg} className={s.header}>
        <HStack spacing={3} flexWrap="wrap" alignItems="center">
          <Text color={textColor}>Station météo du </Text>
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

      <Box bg={bg} className={s.header} mt={0} mb={0}>
        <DateRangePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          zones={zones}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
        />
      </Box>

      {activeGraph?.wind_radar_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <WindRadarMain filters={filters} />
        </Box>
      )}
      {activeGraph?.weather_temperature_humidity_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <TempuratureHumidtyMain filters={filters} />
        </Box>
      )}
      {activeGraph?.weather_temperature_humidity_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <VPDMain filters={filters} />
        </Box>
      )}
      {activeGraph?.et0_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <ET0Main filters={filters} />
        </Box>
      )}
      {activeGraph?.wind_speed_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <WindSpeedMain filters={filters} />
        </Box>
      )}
      {activeGraph?.solar_radiation_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <SolarRadiationMain filters={filters} />
        </Box>
      )}
      {activeGraph?.cumulative_precipitation_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <CumulPrecipitationMain filters={filters} />
        </Box>
      )}
      {activeGraph?.precipitation_rate_status && (
        <Box bg={bg} className={`${s.box} ${s.wide}`}>
          <PrecipitationRateMain filters={filters} />
        </Box>
      )}
    </div>
  );
};

export default StationMain;
