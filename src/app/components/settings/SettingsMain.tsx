'use client';
import React from 'react';
import './SettingsMain.css';
import { Box, Text } from '@chakra-ui/react';
import useColorModeStyles from '@/app/utils/useColorModeStyles';

const SettingsMain = () => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Paramètres</Text>
      </Box>
      <Box bg={bg} className="wide text-box">
        <Text fontSize="md" color="gray.500">
          Plus d’options de configuration seront bientôt disponibles.
        </Text>
      </Box>
      {/* <Box bg={bg} className="wide text-box">
        <SensorColorSettings />
      </Box>
      <Box bg={bg} className="wide text-box">
        <GraphNameSettings />
      </Box> */}
    </div>
  );
};

export default SettingsMain;
