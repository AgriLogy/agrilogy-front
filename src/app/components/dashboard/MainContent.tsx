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
        <Box flex="1" minW={0} minH={0} w="100%" overflow="auto">
          <GoogleMapWeather />
        </Box>
      </Box>
      <Box {...cardProps} className="box">
        <Box flex="1" minW={0} minH={0} w="100%" overflow="auto">
          <WeatherDashboard />
        </Box>
      </Box>
      <Box {...cardProps} className="box">
        <Box flex="1" minW={0} minH={0} w="100%" overflow="auto">
          <Zones />
        </Box>
      </Box>
      <Box {...cardProps} className="box">
        <Box flex="1" minW={0} minH={0} w="100%" overflow="auto">
          <ElectrovannesList />
        </Box>
      </Box>
    </div>
  );
};

export default MainContent;
