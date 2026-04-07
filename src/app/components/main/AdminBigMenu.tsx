import React, { useEffect, useState } from 'react';
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  useColorMode,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FaUser } from 'react-icons/fa';
import Image from 'next/image';
import api from '@/app/lib/api';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import logo from '../../public/logo.png';

const AdminBigMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { bg } = useColorModeStyles();
  const [username, setUsername] = useState('User');

  useEffect(() => {
    api
      .get('/api/header/')
      .then((response) => setUsername(response.data.username))
      .catch((error) => console.error('Error fetching header data', error));
  }, []);

  return (
    <Flex
      justify="space-between"
      align="center"
      px={6}
      py={3}
      bg={bg}
      height="60px"
    >
      <Link href="/">
        <Image height={40} src={logo} alt="Logo" priority />
      </Link>
      <Flex align="center" gap={4}>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FaUser />}
            aria-label="Profile"
            variant="ghost"
          />
          <MenuList>
            <MenuItem>Bonjour {username}</MenuItem>
          </MenuList>
        </Menu>
        <IconButton
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          aria-label="Toggle Color Mode"
          variant="ghost"
          onClick={toggleColorMode}
        />
      </Flex>
    </Flex>
  );
};

export default AdminBigMenu;
