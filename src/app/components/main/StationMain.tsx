'use client';
import React, { useEffect, useState } from 'react';
import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';

import useColorModeStyles from '@/app/utils/useColorModeStyles';
import api from '@/app/lib/api';
import '@/app/styles/style.css';

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
    <div className="container">
      <Box bg={bg} className="header">
        <HStack>
          <Text color={textColor}>Station météo du </Text>
          <select
            value={selectedZone ?? ''}
            onChange={(e) => setSelectedZone(Number(e.target.value))}
            style={{
              borderRadius: '2px',
              padding: '4px',
              color: useColorModeValue('black', 'white'),
              border: `1px solid ${useColorModeValue('black', 'white')}`,
            }}
          >
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        </HStack>
      </Box>

      <Box bg={bg} className="header" mt={0} mb={0}>
        <DateRangePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          zones={zones}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
        />
      </Box>

      {activeGraph?.weather_temperature_humidity_status && (
        <Box bg={bg} className="box wide">
          <TempuratureHumidtyMain filters={filters} />
        </Box>
      )}
      {activeGraph?.weather_temperature_humidity_status && (
        <Box bg={bg} className="box wide">
          <VPDMain filters={filters} />
        </Box>
      )}
      {activeGraph?.et0_status && (
        <Box bg={bg} className="box wide">
          <ET0Main filters={filters} />
        </Box>
      )}
      {activeGraph?.wind_speed_status && (
        <Box bg={bg} className="box wide">
          <WindSpeedMain filters={filters} />
        </Box>
      )}
      {activeGraph?.wind_radar_status && (
        <Box bg={bg} className="box wide">
          <WindRadarMain filters={filters} />
        </Box>
      )}
      {activeGraph?.solar_radiation_status && (
        <Box bg={bg} className="box wide">
          <SolarRadiationMain filters={filters} />
        </Box>
      )}
      {activeGraph?.cumulative_precipitation_status && (
        <Box bg={bg} className="box wide">
          <CumulPrecipitationMain filters={filters} />
        </Box>
      )}
      {activeGraph?.precipitation_rate_status && (
        <Box bg={bg} className="box wide">
          <PrecipitationRateMain filters={filters} />
        </Box>
      )}
    </div>
  );
};

export default StationMain;
