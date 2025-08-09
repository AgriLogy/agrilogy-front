import "./MainContent.css";
import { Box, Text } from "@chakra-ui/react";
import Zones from "./Zones";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import GoogleMapWeather from "../GoogleMapWeather";
import ElectrovannesList from "./ElectrovannesList";
import WeatherDashboard from "./WeatherDashboard";

const MainContent = () => {
  const { bg, textColor } = useColorModeStyles();
  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Dashboard</Text>
      </Box>
      <Box bg={bg} className="box">
        <WeatherDashboard />
      </Box>
      <Box bg={bg} className="box"></Box>
      <Box bg={bg} className="box">
        <Zones />
      </Box>
      <Box bg={bg} className="box" pt={4} pl={4}>
        <ElectrovannesList />
      </Box>
      <Box bg={bg} className="box wide">
        <GoogleMapWeather />
        {/* <OpenStreetMap lon={lon} lat={lat} /> */}
      </Box>
    </div>
  );
};

export default MainContent;
