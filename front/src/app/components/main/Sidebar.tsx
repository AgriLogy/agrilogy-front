"use client";
import React, { useRef } from "react";
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
} from "@chakra-ui/react";
import { FaHome, FaCog, FaBell } from "react-icons/fa";
import { FaSeedling } from "react-icons/fa6";
import { WiDaySunny } from "react-icons/wi";
import { GiGrapes } from "react-icons/gi";
import { IoLogOut } from "react-icons/io5";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const { bg, hoverColor } = useColorModeStyles();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    onClose();
    router.push("/login");
  };

  return (
    <>
      <Flex
        direction="column"
        align="center"
        bg={bg}
        p={4}
        width="100%"
        height="100%"
      >
        {/* Home */}
        <Tooltip label="Accueil" aria-label="Accueil">
          <Link href="/">
            <IconButton
              icon={<FaHome />}
              aria-label="Accueil"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        {/* Soil Data */}
        <Tooltip label="Données du sol" aria-label="Données du sol">
          <Link href="/soil">
            <IconButton
              icon={<FaSeedling />}
              aria-label="Données du sol"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        {/* Weather Station */}
        <Tooltip label="Station météo" aria-label="Station météo">
          <Link href="/station">
            <IconButton
              icon={<WiDaySunny />}
              aria-label="Station météo"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        {/* Plant Analytics */}
        <Tooltip label="Données des plantes" aria-label="Données des plantes">
          <Link href="/plant">
            <IconButton
              icon={<GiGrapes />}
              aria-label="Données des plantes"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        {/* Settings */}
        <Tooltip label="Paramètres" aria-label="Settings">
          <Link href="/settings">
            <IconButton
              icon={<FaCog />}
              aria-label="Settings"
              variant="ghost"
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        {/* Notifications */}
        <Tooltip label="Alertes" aria-label="Notifications">
          <Link href="/alerts">
            <IconButton
              icon={<FaBell />}
              aria-label="Notifications"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        {/* Logout */}
        <Tooltip label="Se déconnecter" aria-label="Logout">
          <IconButton
            icon={<IoLogOut style={{ transform: "scaleX(-1)" }} />}
            aria-label="Logout"
            variant="ghost"
            onClick={onOpen}
            _hover={{ color: hoverColor }}
          />
        </Tooltip>
      </Flex>

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
