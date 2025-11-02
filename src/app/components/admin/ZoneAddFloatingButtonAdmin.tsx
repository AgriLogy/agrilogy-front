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

interface Props {
  user : string;
}
import ZoneModalAddFormComponent from "./ZoneModalAddFormAdmin"; // Adjust path

const ZoneAddFloatingButton = ({ user }: Props) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <IconButton
        aria-label="Add User"
        icon={<AddIcon />}
        position="fixed"
        bottom="20px"
        right="20px"
        borderRadius="50%"
        size="lg"
        colorScheme="blue"
        onClick={() => setIsConfirmOpen(true)}
      />

      {/* Confirmation Modal */}
      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Créer un nouvel utilisateur</ModalHeader>
          <ModalBody>
            <Text>Voulez-vous créer une nouvelle zone pour {user} ?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => {
              setIsConfirmOpen(false);
              setShowForm(true);
            }}>
              Oui
            </Button>
            <Button variant="ghost" ml={3} onClick={() => setIsConfirmOpen(false)}>
              Non
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Zone Creation Form Modal */}
      <ZoneModalAddFormComponent
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        user={user}
      />
    </>
  );
};
export default ZoneAddFloatingButton;