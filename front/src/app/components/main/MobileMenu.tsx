"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Flex,
  IconButton,
  Link,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useColorMode,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon, BellIcon } from "@chakra-ui/icons";
import {
  FaUser,
  FaHome,
  FaComments,
  FaCog,
  FaUserFriends,
  FaLeaf,
} from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import Image from "next/image";
import logo from "../../public/logo.png";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import api from "@/app/lib/api";
import { PiSigmaBold } from "react-icons/pi";

const MobileMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { bg } = useColorModeStyles();

  const [username, setUsername] = useState("User");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/v1/profile/");
        setUsername(response.data.first_name);
      } catch (error) {
        console.error("[MobileMenu] Error fetching user data.");
      }
    };
    fetchUser();
  }, []);
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);

  return (
    <Flex
      as="header"
      justify="space-between"
      align="center"
      px={4}
      height="60px"
      bg={bg}
      boxShadow="sm"
    >
      {/* Logo */}
      <Link href="/">
        <Image
          height={40}
          width={100}
          src={logo}
          alt="Logo"
          style={{ objectFit: "contain" }}
        />
      </Link>

      <Flex justify="space-between" bg={bg}>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FaUser />}
            aria-label="Profile"
            variant="ghost"
          />
          <MenuList>
            <MenuItem>Bonjour {username}</MenuItem>
            <MenuItem icon={<FaUser />}>
              <Link href="/profile">Profile</Link>
            </MenuItem>
            <MenuItem icon={<BellIcon />}>
              <Link href="/Notifications">Notifications</Link>
            </MenuItem>
            <MenuItem
              onClick={onOpen}
              icon={<IoLogOut style={{ transform: "scaleX(-1)" }} />}
            >
              Log Out
            </MenuItem>
          </MenuList>
        </Menu>
        {/* Burger Menu */}
        <IconButton
          icon={<HamburgerIcon />}
          aria-label="Open Menu"
          variant="ghost"
          onClick={() => setIsDrawerOpen(true)}
        />
      </Flex>

      {/* Full-Screen Drawer Menu */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Flex direction="column" gap={4}>
              <Link href="/">
                <Button
                  leftIcon={<FaHome />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Home
                </Button>
              </Link>
              <Link href="/analytics">
                <Button
                  leftIcon={<FaLeaf />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Analytics
                </Button>
              </Link>
              <Link href="/station">
                <Button
                  leftIcon={<PiSigmaBold />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Station météo
                </Button>
              </Link>
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

              <Button
                leftIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                justifyContent="flex-start"
              >
                {colorMode === "light" ? "Dark Mode" : "Light Mode"}
              </Button>
              <Button
                leftIcon={<IoLogOut />}
                colorScheme="red"
                onClick={() => setIsLogoutOpen(true)}
                variant="ghost"
                justifyContent="flex-start"
              >
                Log Out
              </Button>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Logout
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to log out?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsLogoutOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => setIsLogoutOpen(false)}
                ml={3}
              >
                Log Out
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default MobileMenu;
