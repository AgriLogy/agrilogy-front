'use client';
import React, { useRef } from 'react';
import {
  Flex,
  IconButton,
  Box,
  Tooltip,
  Link,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
// import { FaHome, FaCog, FaBell } from "react-icons/fa";
import { MdWarningAmber } from 'react-icons/md';
import { FaSeedling } from 'react-icons/fa6';
import { WiDaySunny } from 'react-icons/wi';
import { GiGrapes, GiValve } from 'react-icons/gi';
import { IoLogOut } from 'react-icons/io5';
import { FaHome, FaWater } from 'react-icons/fa';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { useRouter, usePathname } from 'next/navigation';

const Sidebar = () => {
  const { SideBarbg, hoverColor, iconColor } = useColorModeStyles();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.clear();
    onClose();
    router.push('/login');
  };

  const navItems = [
    { href: '/', icon: <FaHome />, label: 'Accueil' },
    { href: '/soil', icon: <FaSeedling />, label: 'Données du sol' },
    { href: '/station', icon: <WiDaySunny />, label: 'Station météo' },
    { href: '/plant', icon: <GiGrapes />, label: 'Données des plantes' },
    { href: '/water', icon: <FaWater />, label: "Station d'eau" },
    {
      href: '/vannes-pompes',
      icon: <GiValve />,
      label: 'Vannes et pompes',
    },
    // { href: "/settings", icon: <FaCog />, label: "Paramètres" },
    { href: '/alerts', icon: <MdWarningAmber />, label: 'Alertes' },
  ];

  return (
    <>
      <Flex
        direction="column"
        align="center"
        bg={SideBarbg}
        p={4}
        width="100%"
        height="100%"
      >
        {navItems.map((item, idx) => (
          <React.Fragment key={item.href}>
            <Tooltip label={item.label} aria-label={item.label}>
              <Link href={item.href}>
                <IconButton
                  icon={item.icon}
                  aria-label={item.label}
                  variant="ghost"
                  // color={iconColor}
                  mb={2}
                  _hover={{ color: hoverColor }}
                  color={pathname === item.href ? hoverColor : iconColor} // highlight active
                />
              </Link>
            </Tooltip>
            {idx < navItems.length - 1 && (
              <Box height="1px" width="20px" bg="gray.400" mb={2} />
            )}
          </React.Fragment>
        ))}

        {/* Logout */}
        <Box height="1px" width="20px" bg="gray.400" mb={2} />
        <Tooltip label="Se déconnecter" aria-label="Logout">
          <IconButton
            icon={<IoLogOut style={{ transform: 'scaleX(-1)' }} />}
            aria-label="Logout"
            variant="ghost"
            onClick={onOpen}
            _hover={{ color: hoverColor }}
          />
        </Tooltip>
      </Flex>

      {/* Logout Confirmation */}
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
    </>
  );
};

export default Sidebar;
