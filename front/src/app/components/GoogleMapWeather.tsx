import { Box, Heading, useBreakpointValue } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useColorModeStyles from "../utils/useColorModeStyles";
import weather from "../public/weather.png";
import Loading from "./common/Loading";
const GoogleMapWeather = () => {
  const p = useBreakpointValue({ base: 2, md: 4 });
  const { bg, textColor } = useColorModeStyles();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, [loading]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Box
      width="100%"
      height="100%"
      bg={bg}
      borderRadius="md"
      boxShadow="lg"
      p={p}
      overflowX="auto" // Ensure horizontal scroll is supported
    >
      <Heading as="h3" size="md" color={textColor} mb={4}>
        Localisation de la Station Météorologique
      </Heading>
      {/* <iframe
        title="Google Maps"
        width="100%"
        height="100%"
        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=Paris,France`}
        allowFullScreen
        ></iframe> */}
      <Image src={weather} alt="" />
    </Box>
  );
};

export default GoogleMapWeather;
