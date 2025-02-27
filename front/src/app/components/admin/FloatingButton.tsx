"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Floating Button */}
      <IconButton
        aria-label="Add User"
        icon={<AddIcon />}
        position="fixed"
        bottom="20px"
        right="20px"
        borderRadius="50%"
        size="lg"
        colorScheme="blue"
        onClick={() => setIsOpen(true)}
      />

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Créer un nouvel utilisateur</ModalHeader>
          <ModalBody>
            <Text>Voulez-vous créer un nouvel utilisateur ?</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => router.push("/admin/users/create")}
            >
              Oui
            </Button>
            <Button variant="ghost" ml={3} onClick={() => setIsOpen(false)}>
              Non
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FloatingButton;
