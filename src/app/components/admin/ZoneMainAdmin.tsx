import React, { useState, useEffect } from 'react';
import { Box, Text, SimpleGrid } from '@chakra-ui/react';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import axiosInstance from '@/app/lib/api';
import ZoneCard from './ZoneCard';
import ZoneEditModal from './ZoneEditModalAdmin'; // Import ZoneEditModal
import { ZoneType, ZoneWrapper } from '@/app/types';
import ZoneAddFloatingButton from './ZoneAddFloatingButtonAdmin';
import EmptyBox from '../common/EmptyBox';

type Props = {
  user: string;
};

const ZoneMain = ({ user }: Props) => {
  const { bg, textColor } = useColorModeStyles();
  const [zones, setZones] = useState<ZoneWrapper[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [selectedZone, setSelectedZone] = useState<ZoneType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/zone-per-user/${user}/`);
        console.log('API Response:', response.data);
        const ZoneWrapper: ZoneWrapper[] = response.data || [];
        setZones(ZoneWrapper);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };
    fetchData();
  }, []);

  const handleZoneClick = (zone: ZoneType) => {
    setSelectedZone(zone); // Set the zone to edit
    setIsModalOpen(true); // Open the modal
  };

  const handleUpdateZone = (updatedZone: ZoneType) => {
    setZones((prevZones) =>
      prevZones.map((zone) =>
        zone.id === updatedZone.id ? { ...zone, ...updatedZone } : zone
      )
    );
  };

  if (error) return <EmptyBox />;

  return (
    <>
      <Box
        className="header "
        bg={bg}
        p={4}
        m={2}
        mb={4}
        borderRadius="md"
        boxShadow="sm"
        border="1px solid"
      >
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Liste des zones pour {user}{' '}
        </Text>
      </Box>
      {zones.length > 0 && (
        <Box m={2}>
          <SimpleGrid mt={4} spacing={4} columns={{ base: 1, sm: 2, md: 3 }}>
            {zones.map((zoneWrapper) => (
              <ZoneCard
                key={zoneWrapper.zone.id}
                zone={zoneWrapper.zone}
                onClick={() => handleZoneClick(zoneWrapper.zone)}
              />
            ))}
          </SimpleGrid>
        </Box>
      )}{' '}
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
      <ZoneAddFloatingButton user={user} />
    </>
  );
};

export default ZoneMain;
