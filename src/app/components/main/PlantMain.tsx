'use client';
import React, { useEffect, useState } from 'react';
import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';

import useColorModeStyles from '@/app/utils/useColorModeStyles';
import api from '@/app/lib/api';
import { logOptionalApiFailure } from '@/app/utils/apiClientErrors';
import s from '@/app/styles/style.module.css';

import DateRangePicker from '../analytics/DateRangePicker';
import getActiveGraphs, {
  ActiveGraphResponse,
} from '@/app/utils/getActiveGraphs';

import FruiteSizeMain from '../analytics/fruiteSize/FruiteSizeMain';
import LargeFruitDiameterMain from '../analytics/LargeFruitDiameter/LargeFruitDiameterMain';
import SensorLeafMain from '../analytics/Leaf/SensorLeafMain';
import ZoneNotificationBell from '@/app/components/common/ZoneNotificationBell';

const PlantMain = () => {
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
      <Box bg={bg} className={s.header}>
        <HStack spacing={3} flexWrap="wrap" alignItems="center">
          <Text color={textColor}>Données des plantes du </Text>
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
