import React from 'react';
import { VStack, Text, Box } from '@chakra-ui/react';
import ElectrovanStatus from './ElectrovanStatus';
import { electrovanneList } from '@/app/data/dashboard/electrovannes'; // adjust path as needed

const ElectrovannesList = () => {
  return (
    <>	
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        État des Électrovannes
      </Text>
      <VStack spacing={4} align="stretch">
        {electrovanneList.map((vanne) => (
			<ElectrovanStatus
            key={vanne.id}
            vanneName={vanne.vanneName}
            statusMode={vanne.statusMode}
            devEUI={vanne.devEUI}
            isInitiallyActivated={vanne.isActivated}
			/>
        ))}
      </VStack>
	  </>
  );
};

export default ElectrovannesList;
