'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
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
  IconButton,
} from '@chakra-ui/react';
import { FaPen } from 'react-icons/fa';
import {
  SENSOR_CATALOG,
  getAllSensorsCatalog,
  getCustomSensorsCatalog,
  saveCustomSensorsCatalog,
  type SensorCatalogItem,
} from '@/app/utils/sensorCatalog';
import {
  loadSensorInstanceOverrides,
  mergeCatalogWithOverrides,
  saveSensorInstanceOverrides,
  type SensorInstanceOverride,
  type SensorInstanceOverridesMap,
} from '@/app/utils/sensorInstanceOverrides';
import useColorModeStyles from '@/app/utils/useColorModeStyles';

const PLACEMENT_OPTIONS = [
  'Sol',
  'Eau',
  'Météo',
  'Serre',
  'Feuille / fruit',
  'Électricité',
  'Autre',
];

const SensorDirectorySettings = () => {
  const { mutedTextColor } = useColorModeStyles();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [catalog, setCatalog] = useState<SensorCatalogItem[]>(SENSOR_CATALOG);
  const [overrides, setOverrides] = useState<SensorInstanceOverridesMap>({});
  const [openAdd, setOpenAdd] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [form, setForm] = useState({
    readingLabel: '',
    typeLabel: '',
    key: '',
    defaultUnit: '',
  });
  const [editDraft, setEditDraft] = useState<SensorInstanceOverride>({});

  useEffect(() => {
    setCatalog(getAllSensorsCatalog(true));
    setOverrides(loadSensorInstanceOverrides());
  }, []);

  const merged = useMemo(
    () => mergeCatalogWithOverrides(catalog, overrides),
    [catalog, overrides]
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return merged;
    return merged.filter((item) => {
      const hay =
        `${item.readingLabel} ${item.typeLabel} ${item.key} ${item.defaultUnit} ${item.displayName ?? ''} ${item.placementType ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, merged]);

  const startEdit = (item: SensorCatalogItem & SensorInstanceOverride) => {
    setEditKey(item.key);
    setEditDraft({
      displayName: item.displayName ?? item.readingLabel,
      placementType: item.placementType ?? '',
      visible: item.visible !== false,
    });
  };

  const saveEdit = () => {
    if (!editKey) return;
    const next: SensorInstanceOverridesMap = {
      ...overrides,
      [editKey]: {
        displayName: editDraft.displayName?.trim() || undefined,
        placementType: editDraft.placementType?.trim() || undefined,
        visible: editDraft.visible !== false,
      },
    };
    setOverrides(next);
    saveSensorInstanceOverrides(next);
    setEditKey(null);
    toast({ title: 'Capteur mis à jour', status: 'success', duration: 2000 });
  };

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

    const nextItem: SensorCatalogItem = {
      key,
      readingLabel,
      typeLabel,
      defaultUnit,
      category: 'sensor',
    };

    const custom = getCustomSensorsCatalog();
    saveCustomSensorsCatalog([...custom, nextItem]);
    setCatalog(getAllSensorsCatalog());
    setOpenAdd(false);
    setForm({ readingLabel: '', typeLabel: '', key: '', defaultUnit: '' });
    toast({
      title: 'Capteur ajouté',
      status: 'success',
      duration: 2200,
      isClosable: true,
    });
  };

  const isBuiltIn = (key: string) => SENSOR_CATALOG.some((s) => s.key === key);

  return (
    <Box>
      <Flex gap={2} mb={3} align="center" flexWrap="wrap">
        <Input
          placeholder="Rechercher un capteur (nom, type, emplacement, clé)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxW="480px"
        />
        <Button size="sm" colorScheme="blue" onClick={() => setOpenAdd(true)}>
          Ajouter capteur
        </Button>
      </Flex>
      <Text fontSize="sm" color={mutedTextColor} mb={2}>
        {rows.length} capteur(s) affiché(s)
      </Text>
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th>Nom affiché</Th>
            <Th>Type / emplacement</Th>
            <Th>Clé</Th>
            <Th>Unité</Th>
            <Th>Visible</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row) => (
            <Tr key={row.key}>
              <Td>{row.displayName ?? row.readingLabel}</Td>
              <Td>
                {row.placementType
                  ? `${row.typeLabel} — ${row.placementType}`
                  : row.typeLabel}
              </Td>
              <Td>{row.key}</Td>
              <Td>{row.defaultUnit}</Td>
              <Td>{row.visible === false ? 'Non' : 'Oui'}</Td>
              <Td>
                <IconButton
                  aria-label="Modifier"
                  size="sm"
                  icon={<FaPen />}
                  variant="ghost"
                  onClick={() => startEdit(row)}
                />
              </Td>
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

      <Modal
        isOpen={editKey != null}
        onClose={() => setEditKey(null)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modifier le capteur</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Nom affiché</FormLabel>
              <Input
                value={editDraft.displayName ?? ''}
                onChange={(e) =>
                  setEditDraft((d) => ({ ...d, displayName: e.target.value }))
                }
                placeholder="Nom personnalisé"
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Type d&apos;emplacement</FormLabel>
              <Input
                list="placement-suggestions"
                value={editDraft.placementType ?? ''}
                onChange={(e) =>
                  setEditDraft((d) => ({ ...d, placementType: e.target.value }))
                }
                placeholder="Ex. Sol, Serre…"
              />
              <datalist id="placement-suggestions">
                {PLACEMENT_OPTIONS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </FormControl>
            <Checkbox
              isChecked={editDraft.visible !== false}
              onChange={(e) =>
                setEditDraft((d) => ({ ...d, visible: e.target.checked }))
              }
            >
              Visible dans les listes
            </Checkbox>
            {editKey && isBuiltIn(editKey) && (
              <Text fontSize="xs" color={mutedTextColor} mt={3}>
                Capteur catalogue : les métadonnées sont surchargées localement
                uniquement.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={2} onClick={() => setEditKey(null)}>
              Annuler
            </Button>
            <Button colorScheme="blue" onClick={saveEdit}>
              Enregistrer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SensorDirectorySettings;
