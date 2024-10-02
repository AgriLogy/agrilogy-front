"use client";
import React from 'react';
import {
  Flex,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { BellIcon, SettingsIcon } from '@chakra-ui/icons';
import { FaUser } from "react-icons/fa";
import { MoonIcon, SunIcon } from '@chakra-ui/icons'; // Import icons for toggle

const Header = () => {
  const { toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.200', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  return (
    <Flex
      justify="space-between"
      align="center"
      p={4}
      bg={bgColor}
      h="100%"
    >
      <Text color={textColor} fontSize="xl" fontWeight="bold">
        Agligogy
      </Text>

      <Flex align="center">
        <IconButton
          icon={<BellIcon />}
          aria-label="Notifications"
          variant="ghost"
          mr={4}
        />
        
        <Menu>
          <MenuButton as={IconButton} icon={<FaUser />} aria-label="Profile" variant="ghost" />
          <MenuList>
            <MenuItem>Welcome User</MenuItem>
            <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>
          </MenuList>
        </Menu>

        <IconButton
          icon={useColorModeValue(<MoonIcon />, <SunIcon />)} // Use icons instead of strings
          aria-label="Toggle Color Mode"
          variant="ghost"
          onClick={toggleColorMode}
          ml={4}
        />
      </Flex>
    </Flex>
  );
};

export default Header;
