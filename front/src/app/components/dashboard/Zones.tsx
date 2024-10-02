"use client";

import { Zone, zones } from "@/app/data/dashboard/zones";
import React, { useState, useEffect } from "react";
import "./Zones.css";
import { Box, useBreakpointValue,  useColorModeValue, Text, useColorMode } from "@chakra-ui/react";

const Zones = () => {
  const [zoneData, setZoneData] = useState<Zone[]>([]);

  useEffect(() => {
    const fetchZones = () => {
      setTimeout(() => {
        setZoneData(zones);
      }, 100);
    };

    fetchZones();
  }, []);

  const handleZoneClick = (zoneId: number) => {
    console.log(`Redirecting to config page for zone ${zoneId}`);
  };

  const tableBg = useColorModeValue("white", "gray.800");
  const p = useBreakpointValue({ base: 2, md: 4 });
  const { colorMode } = useColorMode();


  return (
    <Box
      width="100%"
      height='100%'
      bg={tableBg}
      borderRadius="md"
      boxShadow="lg"
      p={p}
      overflowX="auto"
    >
      <Text color={colorMode === "light" ? "gray.700" : "gray.200"} fontSize="lg" fontWeight="bold" mb={4}>
        Zones disponibles
      </Text>
      <div className="zone-container">
        {zoneData.length > 0 ? (
          zoneData.map((zone) => (
            <>
              <div
                key={zone.id}
                className="zone-box"
                onClick={() => handleZoneClick(zone.id)}
              >
                {zone.name}
              </div>
            </>
          ))
        ) : (
          <div>
            There are no zones.{" "}
            <button onClick={() => console.log("Create zone")}>
              Click here to create one
            </button>
          </div>
        )}
      </div>
      <div className=" zone-box wide">Config page</div>
    </Box>
  );
};

export default Zones;
