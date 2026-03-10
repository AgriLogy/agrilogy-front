import React from 'react';
import { Box, Text, Tag, Badge } from '@chakra-ui/react';
import useColorModeStyles from '@/app/utils/useColorModeStyles';

export type Electrovanne = {
  id: number;
  vanneName: string;
  statusMode: 'manual' | 'auto';
  devEUI: string;
  isActivated: boolean;
};

interface Props {
  electrovanne: Electrovanne;
  onClick?: () => void;
}

const ElectrovanCard = ({ electrovanne, onClick }: Props) => {
  const { bg, hoverColor, textColor } = useColorModeStyles();

  return (
    <Box
      bg={bg}
      p={2}
      borderWidth="1px"
      borderRadius="xl"
      boxShadow="md"
      _hover={{ cursor: 'pointer', borderColor: hoverColor }}
      onClick={onClick}
    >
      <Text fontWeight="bold" fontSize="lg" color={textColor}>
        {electrovanne.vanneName}
      </Text>

      <Text color={textColor} fontSize="sm">
        🔌 DevEUI: <Badge>{electrovanne.devEUI}</Badge>
      </Text>

      <Text color={textColor} fontSize="sm" mt={2}>
        ⚙️ Mode:{' '}
        <Tag
          colorScheme={electrovanne.statusMode === 'manual' ? 'yellow' : 'blue'}
          textTransform="capitalize"
        >
          {electrovanne.statusMode}
        </Tag>
      </Text>

      <Text color={textColor} fontSize="sm" mt={2}>
        💡 Status:{' '}
        <Tag colorScheme={electrovanne.isActivated ? 'green' : 'red'}>
          {electrovanne.isActivated ? 'Activé' : 'Déactivé'}
        </Tag>
      </Text>
    </Box>
  );
};

export default ElectrovanCard;
