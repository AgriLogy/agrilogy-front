'use client';
import React, { useState, useRef, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { HamburgerIcon, MoonIcon, SunIcon, BellIcon } from '@chakra-ui/icons';
import { FaUser, FaHome, FaCog } from 'react-icons/fa';
import { IoLogOut } from 'react-icons/io5';
import Image from 'next/image';
import logo from '../../public/logo.png';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import api from '@/app/lib/api';
import { logOptionalApiFailure } from '@/app/utils/apiClientErrors';
import { FaBell, FaSeedling } from 'react-icons/fa';
import { WiDaySunny } from 'react-icons/wi';
import { GiGrapes, GiValve } from 'react-icons/gi';
import { useRouter } from 'next/navigation';

const MobileMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { bg } = useColorModeStyles();
  const cancelRef = useRef(null);
  const [username, setUsername] = useState('User');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleLogout = () => {
    localStorage.clear();
    onClose();
    router.push('/login');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/header/');

        setUsername(response.data.first_name);
      } catch (error) {
        logOptionalApiFailure('MobileMenu: header', error);
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
          style={{ objectFit: 'contain' }}
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
            <Link href="/profile">
              <MenuItem icon={<FaUser />}>Profile</MenuItem>
            </Link>
            <Link href="/notifications">
              <MenuItem icon={<BellIcon />}>Notifications</MenuItem>
            </Link>
            <MenuItem
              onClick={onOpen}
              icon={<IoLogOut style={{ transform: 'scaleX(-1)' }} />}
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
            <Flex direction="column" gap={4} p={4} w="full">
              <Link href="/">
                <Button
                  leftIcon={<FaHome />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Accueil
                </Button>
              </Link>

              <Link href="/soil">
                <Button
                  leftIcon={<FaSeedling />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Données du sol
                </Button>
              </Link>

              <Link href="/station">
                <Button
                  leftIcon={<WiDaySunny />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Station météo
                </Button>
              </Link>

              <Link href="/plant">
                <Button
                  leftIcon={<GiGrapes />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Données des plantes
                </Button>
              </Link>

              <Link href="/vannes-pompes">
                <Button
                  leftIcon={<GiValve />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Vannes et pompes
                </Button>
              </Link>

              <Link href="/alerts">
                <Button
                  leftIcon={<FaBell />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Alertes
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
                leftIcon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                justifyContent="flex-start"
                w="full"
              >
                {colorMode === 'light' ? 'Mode sombre' : 'Mode clair'}
              </Button>

              <Button
                leftIcon={<IoLogOut />}
                colorScheme="red"
                onClick={onOpen}
                ref={cancelRef}
                variant="ghost"
                justifyContent="flex-start"
                w="full"
              >
                Se déconnecter
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
