// utils/useColorModeStyles.ts
import { useColorMode, useColorModeValue } from '@chakra-ui/react';

const useColorModeStyles = () => {
  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const hoverColor = useColorModeValue('blue.500', 'blue.300');

  return { bg, textColor, toggleColorMode, hoverColor };
};

export default useColorModeStyles;
