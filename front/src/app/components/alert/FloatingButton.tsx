import React from "react";
import { Button } from "@chakra-ui/react";

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
  return (
    <Button
      colorScheme="teal"
      position="fixed"
      bottom="20px"
      right="20px"
      borderRadius="full"
      boxShadow="lg"
      onClick={onClick}
    >
      +
    </Button>
  );
};

export default FloatingButton;
