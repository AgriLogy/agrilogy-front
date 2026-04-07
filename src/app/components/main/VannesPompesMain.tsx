'use client';

import React, { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { MdPowerSettingsNew } from 'react-icons/md';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import ValveSchematic from '@/app/components/vannes-pompes/ValveSchematic';
import PumpSchematic from '@/app/components/vannes-pompes/PumpSchematic';
import {
  dispatchVannesPompesUpdated,
  loadVannesPompesFromStorage,
  VANNES_POMPES_STORAGE_KEY,
  type Pump,
  type Vane,
} from '@/app/utils/vannesPompesStorage';

export type { Pump, Vane };

function newId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const VannesPompesMain = () => {
  const { bg, textColor, borderColor } = useColorModeStyles();
  const [vanes, setVanes] = useState<Vane[]>([]);
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const addVaneModal = useDisclosure();
  const addPumpModal = useDisclosure();
  const [newVaneName, setNewVaneName] = useState('');
  const [newVaneDevEui, setNewVaneDevEui] = useState('');
  const [newPumpName, setNewPumpName] = useState('');

  useEffect(() => {
    const { vanes: v, pumps: p } = loadVannesPompesFromStorage();
    setVanes(v);
    setPumps(p);
    setHydrated(true);
  }, []);

  const persist = useCallback((next: { vanes: Vane[]; pumps: Pump[] }) => {
    localStorage.setItem(VANNES_POMPES_STORAGE_KEY, JSON.stringify(next));
    dispatchVannesPompesUpdated();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persist({ vanes, pumps });
  }, [vanes, pumps, hydrated, persist]);

  const submitVane = () => {
    const name = newVaneName.trim();
    if (!name) return;
    const devEui = newVaneDevEui.trim() || '—';
    setVanes((prev) => [
      ...prev,
      {
        id: newId('vane'),
        name,
        devEui,
        active: false,
      },
    ]);
    setNewVaneName('');
    setNewVaneDevEui('');
    addVaneModal.onClose();
  };

  const submitPump = () => {
    const name = newPumpName.trim();
    if (!name) return;
    setPumps((prev) => [...prev, { id: newId('pump'), name, running: false }]);
    setNewPumpName('');
    addPumpModal.onClose();
  };

  const toggleVane = (id: string) => {
    setVanes((prev) =>
      prev.map((v) => (v.id === id ? { ...v, active: !v.active } : v))
    );
  };

  const togglePump = (id: string) => {
    setPumps((prev) =>
      prev.map((p) => (p.id === id ? { ...p, running: !p.running } : p))
    );
  };

  return (
    <Box p={{ base: 4, md: 6 }} color={textColor}>
      <Heading size="lg" mb={6}>
        Vannes et pompes
      </Heading>

      <HStack flexWrap="wrap" gap={4} mb={8}>
        <Button colorScheme="blue" onClick={addVaneModal.onOpen}>
          Ajouter une vanne
        </Button>
        <Button
          colorScheme="blue"
          variant="outline"
          onClick={addPumpModal.onOpen}
        >
          Ajouter une pompe
        </Button>
        <Button
          as={NextLink}
          href="/vannes-pompes/schema"
          variant="outline"
          colorScheme="teal"
        >
          Vue schéma réseau
        </Button>
      </HStack>

      <Heading size="md" mb={4}>
        Vannes
      </Heading>
      {vanes.length === 0 ? (
        <Text opacity={0.8} mb={10}>
          Aucune vanne. Cliquez sur « Ajouter une vanne » pour en créer une.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6} mb={12}>
          {vanes.map((vane, index) => (
            <VaneCard
              key={vane.id}
              vane={vane}
              schematicLabel={String(index + 1)}
              onToggle={() => toggleVane(vane.id)}
              bg={bg}
              borderColor={borderColor}
            />
          ))}
        </SimpleGrid>
      )}

      <Divider my={8} />

      <Heading size="md" mb={4}>
        Pompes
      </Heading>
      {pumps.length === 0 ? (
        <Text opacity={0.8} mb={0}>
          Aucune pompe. Utilisez « Ajouter une pompe » pour en créer une.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
          {pumps.map((pump) => (
            <PumpCard
              key={pump.id}
              pump={pump}
              onToggle={() => togglePump(pump.id)}
              bg={bg}
              borderColor={borderColor}
            />
          ))}
        </SimpleGrid>
      )}

      <Modal isOpen={addVaneModal.isOpen} onClose={addVaneModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nouvelle vanne</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nom</FormLabel>
                <Input
                  value={newVaneName}
                  onChange={(e) => setNewVaneName(e.target.value)}
                  placeholder="ex. Vanne 1"
                />
              </FormControl>
              <FormControl>
                <FormLabel>DevEUI (optionnel)</FormLabel>
                <Input
                  value={newVaneDevEui}
                  onChange={(e) => setNewVaneDevEui(e.target.value)}
                  placeholder="0004A30B00F7A7FE"
                  fontFamily="mono"
                  fontSize="sm"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={addVaneModal.onClose}>
              Annuler
            </Button>
            <Button colorScheme="blue" onClick={submitVane}>
              Créer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={addPumpModal.isOpen} onClose={addPumpModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nouvelle pompe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Nom</FormLabel>
              <Input
                value={newPumpName}
                onChange={(e) => setNewPumpName(e.target.value)}
                placeholder="ex. Pompe ligne principale"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={addPumpModal.onClose}>
              Annuler
            </Button>
            <Button colorScheme="blue" onClick={submitPump}>
              Créer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

function VaneCard({
  vane,
  schematicLabel,
  onToggle,
  bg,
  borderColor,
}: {
  vane: Vane;
  schematicLabel: string;
  onToggle: () => void;
  bg: string;
  borderColor: string;
}) {
  const accent = vane.active ? 'green.400' : 'red.500';

  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderLeftWidth="4px"
      borderLeftColor={accent}
      borderRadius="md"
      p={4}
      boxShadow="sm"
    >
      <HStack align="flex-start" spacing={4}>
        <Box flexShrink={0}>
          <ValveSchematic active={vane.active} label={schematicLabel} />
        </Box>
        <VStack align="stretch" spacing={2} flex={1}>
          <HStack justify="space-between" align="center">
            <Text fontWeight="bold" fontSize="lg">
              {vane.name}
            </Text>
            <Badge colorScheme="gray" variant="subtle">
              Manuel
            </Badge>
          </HStack>
          <Text fontSize="sm" opacity={0.85} fontFamily="mono">
            DevEUI: {vane.devEui}
          </Text>
          <HStack>
            <Box
              w="10px"
              h="10px"
              borderRadius="full"
              bg={vane.active ? 'green.400' : 'gray.400'}
            />
            <Text fontSize="sm">
              {vane.active ? 'Ouverte (active)' : 'Fermée (inactive)'}
            </Text>
          </HStack>
        </VStack>
      </HStack>
      <Button
        mt={4}
        w="100%"
        leftIcon={<MdPowerSettingsNew />}
        colorScheme={vane.active ? 'green' : 'red'}
        variant={vane.active ? 'solid' : 'solid'}
        onClick={onToggle}
      >
        {vane.active ? 'DÉSACTIVER' : 'ACTIVER'}
      </Button>
    </Box>
  );
}

function PumpCard({
  pump,
  onToggle,
  bg,
  borderColor,
}: {
  pump: Pump;
  onToggle: () => void;
  bg: string;
  borderColor: string;
}) {
  const accent = pump.running ? 'green.400' : 'gray.500';

  return (
    <Box
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderLeftWidth="4px"
      borderLeftColor={accent}
      borderRadius="md"
      p={4}
      boxShadow="sm"
    >
      <HStack align="flex-start" spacing={4}>
        <Box flexShrink={0}>
          <PumpSchematic running={pump.running} />
        </Box>
        <VStack align="stretch" spacing={2} flex={1}>
          <Text fontWeight="bold" fontSize="lg">
            {pump.name}
          </Text>
          <HStack>
            <Box
              w="10px"
              h="10px"
              borderRadius="full"
              bg={pump.running ? 'green.400' : 'gray.400'}
            />
            <Text fontSize="sm">{pump.running ? 'En marche' : 'Arrêtée'}</Text>
          </HStack>
        </VStack>
      </HStack>
      <Button
        mt={4}
        w="100%"
        leftIcon={<MdPowerSettingsNew />}
        colorScheme={pump.running ? 'orange' : 'green'}
        onClick={onToggle}
      >
        {pump.running ? 'ARRÊTER' : 'DÉMARRER'}
      </Button>
    </Box>
  );
}

export default VannesPompesMain;
