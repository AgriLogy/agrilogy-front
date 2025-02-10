import React, { useEffect, useState, useRef } from "react";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Link,
  useColorMode,
  Button,
  Text,
} from "@chakra-ui/react";
import { BellIcon, SettingsIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FaCog, FaUser } from "react-icons/fa";
import Image from "next/image";
import axiosInstance from "@/app/lib/axiosInstance";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import logo from "../../public/logo.png";

const BigMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { bg, hoverColor } = useColorModeStyles();
  const [username, setUsername] = useState("User");

  useEffect(() => {
    axiosInstance
      .get("/api/header/")
      .then((response) => setUsername(response.data.username))
      .catch((error) => console.error("Error fetching header data", error));
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
        <Image height={40} src={logo} alt="Logo" />
      </Link>
      <Flex align="center" gap={4}>
        <Tooltip label="Notifications">
          <Link href="/notifications">
            <IconButton
              icon={<BellIcon />}
              aria-label="Notifications"
              variant="ghost"
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FaUser />}
            aria-label="Profile"
            variant="ghost"
          />
          <MenuList>
            <MenuItem>
              Bonjour {username}
            </MenuItem>
            <Link href="/settings">
              <Button
                leftIcon={<FaCog />}
                variant="ghost"
                justifyContent="flex-start"
                w="full"
              >
                Paramètres
              </Button>
            </Link>
          </MenuList>
        </Menu>
        <IconButton
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          aria-label="Toggle Color Mode"
          variant="ghost"
          onClick={toggleColorMode}
        />
      </Flex>
    </Flex>
  );
};

export default BigMenu;
