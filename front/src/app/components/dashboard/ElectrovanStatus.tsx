import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Tag,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

type ElectrovanStatusProps = {
  vanneName: string;
  statusMode: 'manual' | 'auto';
  devEUI: string;
  isInitiallyActivated?: boolean;
};

const ElectrovanStatus = ({
  vanneName,
  statusMode,
  devEUI,
  isInitiallyActivated = false,
}: ElectrovanStatusProps) => {
  const [isActivated, setIsActivated] = useState(isInitiallyActivated);

  const handleToggle = () => {
    setIsActivated((prev) => !prev);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      shadow="md"
      maxW="sm"
      w="100%"
      bg={useColorModeValue('gray.50', 'gray.700')}
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold">{vanneName}</Text>
        <Tag
          colorScheme={statusMode === 'manual' ? 'yellow' : 'blue'}
          textTransform="capitalize"
        >
          {statusMode}
        </Tag>
      </Flex>

      <Text fontSize="sm" color="gray.500" mb={4}>
        DevEUI: {devEUI}
      </Text>

      <Button
        colorScheme={isActivated ? 'red' : 'green'}
        width="100%"
        onClick={handleToggle}
      >
        {isActivated ? 'Deactivate' : 'Activate'}
      </Button>
    </Box>
  );
};

export default ElectrovanStatus;
