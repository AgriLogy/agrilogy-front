// utils/useColorModeStyles.ts
import { useColorMode, useColorModeValue } from '@chakra-ui/react';

const useColorModeStyles = () => {
  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const SideBarbg = useColorModeValue('gray.50', 'gray.900');
  const headerBarBg = useColorModeValue('white', 'gray.900');
  const headerBarBorder = useColorModeValue('gray.200', 'gray.700');
  const sidebarRailBorder = useColorModeValue('gray.200', 'gray.700');
  const sidebarItemBgActive = useColorModeValue('green.50', 'whiteAlpha.100');
  const sidebarItemColorActive = useColorModeValue('green.700', 'green.300');
  const iconColor = useColorModeValue('gray.600', 'gray.300');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const zoneColor = useColorModeValue('gray.500', 'gray.500');
  const hoverColor = useColorModeValue('brand.500', 'brand.300');
  // const bgColor = useColorModeValue('green.500', 'green.300');
  const navBgColor = useColorModeValue('gray.100', 'gray.600');
  const tableStripeClore = useColorModeValue('gray.400', 'gray.800');

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

  const bgColor = useColorModeValue('white', 'gray.700');
  const thBg = useColorModeValue('gray.100', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const tabAccent = useColorModeValue('brand.600', 'brand.300');

  return {
    bg,
    textColor,
    mutedTextColor,
    tabAccent,
    zoneColor,
    toggleColorMode,
    hoverColor,
    bgColor,
    navBgColor,
    humidityColors,
    solarRadiationColors,
    solarPanelVoltageColors,
    tableStripeClore,
    thBg,
    borderColor,
    SideBarbg,
    headerBarBg,
    headerBarBorder,
    sidebarRailBorder,
    sidebarItemBgActive,
    sidebarItemColorActive,
    iconColor,
  };
};

export default useColorModeStyles;
