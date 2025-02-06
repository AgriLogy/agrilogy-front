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
import { FaHome, FaUsers, FaMapMarkedAlt, FaSignOutAlt } from "react-icons/fa";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import { useRouter } from "next/navigation";

const AdminSidebar = () => {
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
      <Flex direction="column" align="center" bg={bg} p={4} width="100%" height="100%">
        <Tooltip label="Dashboard" aria-label="Dashboard">
          <Link href="/admin/dashboard">
            <IconButton
              icon={<FaHome />}
              aria-label="Dashboard"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        <Tooltip label="Liste des utilisateurs" aria-label="Liste des utilisateurs">
          <Link href="/admin/users/liste">
            <IconButton
              icon={<FaUsers />}
              aria-label="Liste des utilisateurs"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        <Tooltip label="Liste des zones" aria-label="Liste des zones">
          <Link href="/admin/zones/liste">
            <IconButton
              icon={<FaMapMarkedAlt />}
              aria-label="Liste des zones"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        {/* <Box height="1px" width="20px" bg="gray.400" mb={2} />

        <Tooltip label="Statistiques" aria-label="Statistiques">
          <Link href="/stats">
            <IconButton
              icon={<FaChartBar />}
              aria-label="Statistiques"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip> */}

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        {/* Logout icon */}
        <Tooltip label="Se déconnecter" aria-label="Logout">
          <IconButton
            icon={<FaSignOutAlt />}
            aria-label="Logout"
            variant="ghost"
            onClick={onOpen}
            _hover={{ color: hoverColor }}
          />
        </Tooltip>
      </Flex>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmer la déconnexion
            </AlertDialogHeader>

            <AlertDialogBody>Êtes-vous sûr de vouloir vous déconnecter ?</AlertDialogBody>

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

export default AdminSidebar;
