import React, { useEffect, useState } from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import Loading from "@component/common/Loading";
import DashboardCard from "@component/dashboard/DashboardCard";
import OpenStreetMap from "@component/OpenStreetMap";
// import MapboxMap from "./MapboxMap";

const GoogleMapWeather = () => {
  const p = useBreakpointValue({ base: 2, md: 4 });
  const [loading, setLoading] = useState(true);

  const lat = 32.88986; // Latitude for the map
  const lon = -6.914351; // Longitude for the map

  // Use effect to simulate fetching data or performing initial setup
  useEffect(() => {
    setLoading(false); // Set loading to false once data is ready (simulated here)
  }, [loading]);

  // Content of the DashboardCard
  const content = loading ? (
    <Loading />
  ) : (
    <Box
      maxW="100%"
      maxH={{ base: "300px", md: "500px" }}
      height="100%"
      width="100%"
      borderRadius="md"
      overflow="hidden"
    >
      {/* <MapboxMap lat={lat} lon={lon} /> */}
      <OpenStreetMap lat={lat} lon={lon} />
    </Box>
  );

  return (
    <Box
      width="100%"
      height="100%"
      // borderRadius="md"
      // boxShadow="lg"
      p={p}
      overflowX="auto"
    >
      <DashboardCard
        title="Localisation"
        content={content}
      />
    </Box>
  );
};

export default GoogleMapWeather;
