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
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FaUser, FaHome } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import Image from "next/image";
import logo from "../../public/logo.png";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import api from "@/app/lib/api";
import { useRouter } from "next/navigation";

const MobileMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { bg } = useColorModeStyles();
  const cancelRef = useRef(null);
  const [username, setUsername] = useState("User");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleLogout = () => {
    localStorage.clear();
    onClose();
    router.push("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/header/");

        setUsername(response.data.first_name);
      } catch (error) {
        console.error("[MobileMenu] Error fetching user data.");
      }
    };
    fetchUser();
  }, []);

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
            <MenuItem
              onClick={onOpen}
              icon={<IoLogOut style={{ transform: "scaleX(-1)" }} />}
            >
              Déconnexion
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
                  Tableau de board
                </Button>
              </Link>
              <Button
                leftIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                justifyContent="flex-start"
              >
                {colorMode === "light" ? "Mode sombre" : "Mode sombre"}
              </Button>
              <Button
                leftIcon={<IoLogOut />}
                colorScheme="red"
                onClick={onClose}
                ref={cancelRef}
                variant="ghost"
                justifyContent="flex-start"
              >
                Déconnexion
              </Button>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmer la déconnexion
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Annuler
              </Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3}>
                Se déconnecter
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default MobileMenu;
