import './MainContent.css';
import { Box, Text } from '@chakra-ui/react';
import Zones from './ZonesDashboardCard';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import GoogleMapWeather from '../GoogleMapWeather';
import ElectrovannesList from './ElectrovannesDashboardCard';
import WeatherDashboard from './WeatherDashboard';

const MainContent = () => {
  const { bg, textColor, borderColor } = useColorModeStyles();
  const cardProps = {
    bg,
    borderWidth: '1px',
    borderColor,
    borderStyle: 'solid' as const,
  };
  return (
    <div className="container">
      <Box {...cardProps} className="header">
        <Text color={textColor}>Tableau de board</Text>
      </Box>
      <Box {...cardProps} className="box">
        <GoogleMapWeather />
      </Box>
      <Box {...cardProps} className="box">
        <WeatherDashboard />
      </Box>
      <Box {...cardProps} className="box">
        <Zones />
      </Box>
      <Box {...cardProps} className="box">
        <ElectrovannesList />
      </Box>
    </div>
  );
};

export default MainContent;
