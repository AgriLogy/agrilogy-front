import { Heading, useColorModeValue } from "@chakra-ui/react";
import React from "react";

const GoogleMapWeather = () => {
  const textColor = useColorModeValue("gray.800", "gray.200");

  return (
    <>
      <Heading as="h3" size="md" color={textColor} mb={4}>
        Localisation de la Station Météorologique
      </Heading>
      <iframe
        title="Google Maps"
        width="100%"
        height="100%"
        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=Paris,France`}
        allowFullScreen
      ></iframe>
    </>
  );
};

export default GoogleMapWeather;
