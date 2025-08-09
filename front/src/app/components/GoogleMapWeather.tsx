import { Box, Heading, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useColorModeStyles from "../utils/useColorModeStyles";
import Loading from "./common/Loading";
import OpenStreetMap from "./OpenStreetMap";

const GoogleMapWeather = () => {
  const p = useBreakpointValue({ base: 2, md: 4 });
  const { bg, textColor } = useColorModeStyles();
  const [loading, setLoading] = useState(true);
  const lat = 32.88986;
  const lon = -6.914351;

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
      
      {/* Use Chakra UI Box for OpenStreetMap container */}
      <Box
        maxW="100%"           // Allow full width but restrict it on large screens
        maxH={{ base: "300px", md: "500px" }} // Maximum height based on screen size
        height="100%"         // Take up 100% of available height in the parent container
        width="100%"          // Take up 100% of available width in the parent container
        borderRadius="md"
        overflow="hidden"     // Hide overflow to avoid stretching
        boxShadow="md"
      >
        <OpenStreetMap lat={lat} lon={lon} />
      </Box>
    </Box>
  );
};

export default GoogleMapWeather;
