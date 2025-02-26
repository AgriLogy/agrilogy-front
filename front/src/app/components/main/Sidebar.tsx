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
import { FaHome, FaChartLine, FaLeaf, FaCog } from "react-icons/fa";
import { PiSigmaBold } from "react-icons/pi";
import { IoLogOut } from "react-icons/io5";
import { FaBell } from "react-icons/fa"; // Import the notification icon
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

        <Tooltip label="Données du sol" aria-label="Données du sol">
          <Link href="/analytics">
            <IconButton
              icon={<FaLeaf />}
              // icon={<FaChartLine />}
              aria-label="Données du sol"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        <Tooltip label="Station météo" aria-label="Sigma">
          <Link href="/station">
            <IconButton
              icon={<PiSigmaBold />}
              aria-label="Sigma"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        {/* <Box height="1px" width="20px" bg="gray.400" mb={2} />

        <Tooltip label="Humidité du sol" aria-label="Soil Moisture">
          <Link href="/moisture">
            <IconButton
              icon={<FaLeaf />}
              aria-label="Soil Moisture"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip> */}

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

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

        {/* Notification icon */}
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

        {/* Logout icon */}
        <Tooltip label="Se déconnecter" aria-label="Logout">
          <IconButton
            icon={<IoLogOut style={{ transform: "scaleX(-1)" }} />} // Reverse the icon
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
