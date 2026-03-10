'use client';
import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import './style.css';
import axiosInstance from '@/app/lib/api';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import '@/app/styles/graphes.css';
import EmptyBox from '../common/EmptyBox';

type Props = {
  user: string;
};

const UserAlldata: React.FC<Props> = ({ user }) => {
  const { bg, textColor } = useColorModeStyles();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startDate] = useState<string>('');
  const [endDate] = useState<string>(new Date().toISOString().split('T')[0]);

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
        console.log('API Response:', response.data.sensor_data); // Inspect the structure
        setData(response.data.sensor_data || []);
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

  if (!data.length) {
    return <EmptyBox />;
  }

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
          Données sur les sols de {user}
        </Text>
      </Box>

      {/* Date Range Picker */}
    </div>
  );
};

export default UserAlldata;
