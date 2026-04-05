'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import {
  SENSOR_CATALOG,
  getAllSensorsCatalog,
  getCustomSensorsCatalog,
  saveCustomSensorsCatalog,
  type SensorCatalogItem,
} from '@/app/utils/sensorCatalog';
import useColorModeStyles from '@/app/utils/useColorModeStyles';

const SensorSearchDirectory = ({
  allowAdd = false,
}: {
  allowAdd?: boolean;
}) => {
  const { mutedTextColor } = useColorModeStyles();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [catalog, setCatalog] = useState<SensorCatalogItem[]>(SENSOR_CATALOG);
  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({
    readingLabel: '',
    typeLabel: '',
    key: '',
    defaultUnit: '',
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter((item) => {
      const haystack =
        `${item.readingLabel} ${item.typeLabel} ${item.key} ${item.defaultUnit}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, catalog]);

  useEffect(() => {
    setCatalog(getAllSensorsCatalog(true));
  }, []);

  const addSensor = () => {
    const key = form.key.trim();
    const readingLabel = form.readingLabel.trim();
    const typeLabel = form.typeLabel.trim();
    const defaultUnit = form.defaultUnit.trim();

    if (!key || !readingLabel || !typeLabel || !defaultUnit) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir tous les champs.',
        status: 'warning',
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    if (catalog.some((item) => item.key === key)) {
      toast({
        title: 'Clé déjà utilisée',
        description: 'Cette clé capteur existe déjà.',
        status: 'error',
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    const next: SensorCatalogItem = {
      key,
      readingLabel,
      typeLabel,
      defaultUnit,
      category: 'sensor',
    };

    const custom = getCustomSensorsCatalog();
    saveCustomSensorsCatalog([...custom, next]);
    setCatalog(getAllSensorsCatalog());
    setOpenAdd(false);
    setForm({ readingLabel: '', typeLabel: '', key: '', defaultUnit: '' });
    toast({
      title: 'Capteur ajouté',
      description: 'Le capteur est disponible dans les réglages.',
      status: 'success',
      duration: 2200,
      isClosable: true,
    });
  };

  return (
    <Box>
      <Flex gap={2} mb={3} align="center" flexWrap="wrap">
        <Input
          placeholder="Rechercher un capteur..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxW="420px"
        />
        {allowAdd && (
          <Button size="sm" colorScheme="blue" onClick={() => setOpenAdd(true)}>
            Ajouter capteur
          </Button>
        )}
      </Flex>
      <Text fontSize="sm" color={mutedTextColor} mb={2}>
        {rows.length} capteur(s) trouvé(s)
      </Text>
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th>Libellé</Th>
            <Th>Type</Th>
            <Th>Clé</Th>
            <Th>Unité par défaut</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row) => (
            <Tr key={row.key}>
              <Td>{row.readingLabel}</Td>
              <Td>{row.typeLabel}</Td>
              <Td>{row.key}</Td>
              <Td>{row.defaultUnit}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={openAdd} onClose={() => setOpenAdd(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajouter un capteur</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Libellé</FormLabel>
              <Input
                value={form.readingLabel}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, readingLabel: e.target.value }))
                }
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Type</FormLabel>
              <Input
                value={form.typeLabel}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, typeLabel: e.target.value }))
                }
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Clé (unique)</FormLabel>
              <Input
                value={form.key}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, key: e.target.value }))
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Unité</FormLabel>
              <Input
                value={form.defaultUnit}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, defaultUnit: e.target.value }))
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={2} onClick={() => setOpenAdd(false)}>
              Annuler
            </Button>
            <Button colorScheme="blue" onClick={addSensor}>
              Ajouter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SensorSearchDirectory;
