import { Flex, IconButton, useColorMode, Spacer } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import logo from '../public/logo.png';

const NonAuthNavbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  // const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // const handleDrawerOpen = () => setIsDrawerOpen(true);
  // const handleDrawerClose = () => setIsDrawerOpen(false);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding="1rem"
      boxShadow="sm"
      bg={colorMode === 'light' ? '#C4DAD2' : '#6A9C89'}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Image src={logo} alt="Logo" height={50} />

      <Spacer />
      <IconButton
        aria-label="Toggle dark/light mode"
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        variant="ghost"
      />
    </Flex>
  );
};

export default NonAuthNavbar;
