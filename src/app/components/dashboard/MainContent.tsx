import "./MainContent.css";
import { Box, Text } from "@chakra-ui/react";
import Zones from "./ZonesDashboardCard";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import GoogleMapWeather from "../GoogleMapWeather";
import ElectrovannesList from "./ElectrovannesDashboardCard";
import WeatherDashboard from "./WeatherDashboard";

const MainContent = () => {
  const { bg, textColor } = useColorModeStyles();
  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Tableau de board</Text>
      </Box>
      <Box bg={bg} className="box">
        <GoogleMapWeather />
      </Box>
      <Box bg={bg} className="box">
        <WeatherDashboard />
      </Box>
      <Box bg={bg} className="box">
        <Zones />
      </Box>
      <Box bg={bg} className="box">
        <ElectrovannesList />
      </Box>
    </div>
  );
};

export default MainContent;
