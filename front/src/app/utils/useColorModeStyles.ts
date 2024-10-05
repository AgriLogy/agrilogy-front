// utils/useColorModeStyles.ts
import { useColorMode, useColorModeValue } from '@chakra-ui/react';

const useColorModeStyles = () => {
  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const hoverColor = useColorModeValue('blue.500', 'blue.300');
  const bgColor = useColorModeValue('green.500', 'green.300');
  const navBgColor = useColorModeValue('gray.100', 'gray.600');

  // Define specific colors for indicators
  const humidityColors = {
    red: useColorModeValue('red.500', 'red.300'),
    yellow: useColorModeValue('yellow.500', 'yellow.300'),
    green: useColorModeValue('green.500', 'green.300'),
  };

  const solarRadiationColors = {
    red: useColorModeValue('red.500', 'red.300'),
    yellow: useColorModeValue('yellow.500', 'yellow.300'),
    green: useColorModeValue('green.500', 'green.300'),
  };

  const solarPanelVoltageColors = {
    red: useColorModeValue('red.500', 'red.300'),
    yellow: useColorModeValue('yellow.500', 'yellow.300'),
    green: useColorModeValue('green.500', 'green.300'),
  };

  return {
    bg,
    textColor,
    toggleColorMode,
    hoverColor,
    bgColor,
    navBgColor,
    humidityColors,
    solarRadiationColors,
    solarPanelVoltageColors,
  };
};

export default useColorModeStyles;
