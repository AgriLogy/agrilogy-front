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
  useColorModeValue,
} from '@chakra-ui/react';
import { BellIcon, SettingsIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FaUser } from "react-icons/fa";
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import logo from '../../public/logo.png'
import Image from "next/image";

const Header = () => {
  const { bg, textColor, toggleColorMode } = useColorModeStyles(); // Use the utility

  return (
    <Flex
      justify="space-between"
      align="center"
      p={4}
      bg={bg}
      h="100%"
    >
      <Image height={28} src={logo} alt="" />
{/* 
      <Text color={textColor} fontSize="xl" fontWeight="bold">
        Agrilogy
      </Text> */}

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
          icon={bg === 'gray.200' ? <MoonIcon /> : <SunIcon />} // Toggle icons based on bg color
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
