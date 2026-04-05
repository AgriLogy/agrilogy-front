'use client';

import { Box, Button } from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';

/** Affiché en bas des cartes « dernière valeur » à côté des graphiques. */
export default function LastDataAddAlertButton() {
  return (
    <Box
      as="footer"
      mt="auto"
      pt={4}
      width="100%"
      display="flex"
      justifyContent="center"
    >
      <Button
        type="button"
        colorScheme="red"
        size="sm"
        minW="140px"
        leftIcon={<FaBell aria-hidden />}
        aria-label="Ajouter une alerte"
      >
        Ajouter une alerte
      </Button>
    </Box>
  );
}
