// utils/useColorModeStyles.ts
import { useColorMode, useColorModeValue } from '@chakra-ui/react';

const useColorModeStyles = () => {
  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const hoverColor = useColorModeValue('blue.500', 'blue.300');
  const bgColor = useColorModeValue('green.500', 'green.300'); // Fixed typo 'geen' to 'green'
  const navBgColor = useColorModeValue('gray.100', 'gray.600'); // Define the nav background color

  return { bg, textColor, toggleColorMode, hoverColor, bgColor, navBgColor };
};

export default useColorModeStyles;
