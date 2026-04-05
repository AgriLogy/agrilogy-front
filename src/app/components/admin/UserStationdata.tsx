'use client';
import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import axiosInstance from '@/app/lib/api';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import DateRangePicker from '../analytics/DateRangePicker';
import DataTable from '../station/DataTable';
import Et0Graph from '../station/Et0Graph';
import PluvometricGraph from '../station/PluvometricGraph';
import PrecipitationHumidityGraph from '../station/PrecipitationHumidityGraph';
import SolarRadiationGraph from '../station/SolarRadiationGraph';
import TempHumidityGraph from '../station/TempHumidityGraph';
import VaporPressureDeficitGraph from '../station/VaporPressureDeficitGraph';
import WindDirectionGraph from '../station/WindDirectionGraph';
import WindSpeedGraph from '../station/WindSpeedGraph';
import '@/app/styles/graphes.css';

import './style.css';
import EmptyBox from '../common/EmptyBox';

type Props = {
  user: string;
};

const UserStationdata: React.FC<Props> = ({ user }) => {
  const { bg, textColor } = useColorModeStyles();
  const [stationPayload, setStationPayload] = useState<{
    sensor_data?: any[];
    sensor_names?: Record<string, string>;
    sensor_colors?: Record<string, string>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          user, // Include the user parameter in the POST body
          start_date: startDate,
          end_date: endDate,
        };
        const response = await axiosInstance.post(
          `api/admin-user-data/`,
          payload
        );
        setStationPayload(
          response.data ?? {
            sensor_data: [],
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchData();
  }, [user, startDate, endDate]);

  if (error) {
    return (
      <Box>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!stationPayload?.sensor_data?.length) {
    return <EmptyBox />;
  }

  const data = stationPayload;

  return (
    <div className="container">
      {/* Header */}
      <Box
        className="header"
        bg={bg}
        p={4}
        mb={4}
        borderRadius="md"
        boxShadow="sm"
      >
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Données de la station météo de {user}
        </Text>
      </Box>

      {/* Date Range Picker */}
      <Box bg={bg} className="header" mt={0} mb={0}>
        <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
      </Box>
      <Box bg={bg} className="box wide">
        <Et0Graph data={data} />
      </Box>

      <Box bg={bg} className="box wide">
        <TempHumidityGraph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <WindSpeedGraph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <WindDirectionGraph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <PluvometricGraph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <SolarRadiationGraph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <VaporPressureDeficitGraph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <PrecipitationHumidityGraph data={data} />
      </Box>
      <Box bg={bg} className="box wide">
        <DataTable data={data} />
      </Box>
    </div>
  );
};

export default UserStationdata;
