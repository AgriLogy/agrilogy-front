import React, { useState, useEffect } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import LoadingSpinner from "../common/LoadingSpinner";
import axiosInstance from "@/app/lib/api";
import ZoneCard from "./ZoneCard";
import ZoneEditModal from "./ZoneEditModal"; // Import ZoneEditModal
import { Zone, ZoneWrapper } from "@/app/types";

type Props = {
  user: string;
};

const ZoneMain = ({ user }: Props) => {
  const { bg, textColor } = useColorModeStyles();
  const [zones, setZones] = useState<ZoneWrapper[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null); // Selected zone for editing

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/zone-per-user/${user}/`);
        console.log("API Response:", response.data);
        const ZoneWrapper: ZoneWrapper[] = response.data || [];
        setZones(ZoneWrapper);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };
    fetchData();
  }, []);

  const handleZoneClick = (zone: Zone) => {
    setSelectedZone(zone); // Set the zone to edit
    setIsModalOpen(true); // Open the modal
  };

  const handleUpdateZone = (updatedZone: Zone) => {
    setZones((prevZones) =>
      prevZones.map((zone) =>
        zone.id === updatedZone.id ? { ...zone, ...updatedZone } : zone
      )
    );
  };

  if (error) return <LoadingSpinner />;

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Liste des zones pour {user} </Text>
      </Box>
      <VStack mt={4} spacing={4} align="stretch" className="wide">
        {zones.map((zoneWrapper) => (
          <ZoneCard
            key={zoneWrapper.zone.id}
            zone={zoneWrapper.zone}
            onClick={() => handleZoneClick(zoneWrapper.zone)} // Trigger the modal on click
          />
        ))}
      </VStack>

      {/* ZoneEditModal will open when a zone is selected */}
      {selectedZone && (
        <ZoneEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Close the modal
          zone={selectedZone}
          username={user}
          onUpdate={handleUpdateZone} // Pass the update function
        />
      )}
    </div>
  );
};

export default ZoneMain;
