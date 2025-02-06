import React, { useEffect, useState } from "react";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Link,
} from "@chakra-ui/react";
import { BellIcon, SettingsIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import logo from "../../public/logo.png";
import Image from "next/image";
import axiosInstance from "@/app/lib/axiosInstance";

const HeaderAdmin = () => {
  const { bg, toggleColorMode } = useColorModeStyles();
  const [username, setUsername] = useState("User");
  const { hoverColor } = useColorModeStyles();

  useEffect(() => {
    axiosInstance
      .get("/api/header/")
      .then((response) => {
        const userData = response.data;
        console.log(response.data);
        setUsername(userData.username);
      })
      .catch((error) => {
        console.log("Error fetching header data", error);
      });
  }, []);

  return (
    <Flex justify="space-between" align="center" p={4} bg={bg} h="100%">
      <Image height={28} src={logo} alt="Logo" />
      <Flex align="center">
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FaUser />}
            aria-label="Profile"
            variant="ghost"
          />
          <MenuList>
            <MenuItem>Welcome {username}</MenuItem>
            <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>
          </MenuList>
        </Menu>
        <IconButton
          icon={bg === "gray.200" ? <MoonIcon /> : <SunIcon />}
          aria-label="Toggle Color Mode"
          variant="ghost"
          onClick={toggleColorMode}
          ml={4}
        />
      </Flex>
    </Flex>
  );
};

export default HeaderAdmin;
