"use client";

import React, { useState, useEffect } from "react";
import {
  VStack,
  Box,
  Text,
  useColorModeValue,
  useBreakpointValue,
  useColorMode,
  Spinner,
} from "@chakra-ui/react";
import ZoneCard from "../admin/ZoneCard";
import EmptyBox from "../common/EmptyBox";
import api from "@/app/lib/api";

interface Zone {
  id: number;
  name: string;
  space: number;
  kc: number;
  soil_type: "clay" | "loamy" | "sandy" | "others";
  critical_moisture_threshold: number;
}

interface ZonePerUser {
  zone: Zone;
}

const Zones = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const tableBg = useColorModeValue("white", "gray.800");
  const p = useBreakpointValue({ base: 2, md: 4 });
  const { colorMode } = useColorMode();

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await api.get<ZonePerUser[]>(
          "/api/auth-zone-per-user/"
        );

        const zonesFromAPI = response.data.map((item) => item.zone);
        setZones(zonesFromAPI);
      } catch (error) {
        console.error("Failed to fetch zones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  const handleZoneClick = (zoneId: number) => {
    console.log(`Redirecting to config page for zone ${zoneId}`);
    // You can use router.push if using Next.js routing
  };

  return (
    <Box
      width="100%"
      height="100%"
      bg={tableBg}
      borderRadius="md"
      boxShadow="lg"
      p={p}
      overflowX="auto"
    >
      <Text
        color={colorMode === "light" ? "gray.700" : "gray.200"}
        fontSize="lg"
        fontWeight="bold"
        mb={4}
      >
        Zones disponibles
      </Text>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <Spinner size="xl" color="green.500" />
        </Box>
      ) : zones.length > 0 ? (
        <VStack spacing={4} align="stretch">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              onClick={() => handleZoneClick(zone.id)}
            />
          ))}
        </VStack>
      ) : (
        <EmptyBox />
      )}
    </Box>
  );
};

export default Zones;
