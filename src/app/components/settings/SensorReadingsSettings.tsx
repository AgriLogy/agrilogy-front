'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
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
import { FaCheck, FaPen, FaTimes } from 'react-icons/fa';
import { getAllSensorsCatalog } from '@/app/utils/sensorCatalog';

type UnitSettingRow = {
  key: string;
  readingLabel: string;
  typeLabel: string;
  unit: string;
  scaleA: number;
  offsetB: number;
  lastValue: string;
};

const STORAGE_KEY = 'frontendUnitOverrides';

function getDefaultRows(): UnitSettingRow[] {
  return getAllSensorsCatalog(false).map((item) => ({
    key: item.key,
    readingLabel: item.readingLabel,
    typeLabel: item.typeLabel,
    unit: item.defaultUnit,
    scaleA: 1,
    offsetB: 0,
    lastValue: '—',
  }));
}

function getMountedRows(): UnitSettingRow[] {
  return getAllSensorsCatalog(true).map((item) => ({
    key: item.key,
    readingLabel: item.readingLabel,
    typeLabel: item.typeLabel,
    unit: item.defaultUnit,
    scaleA: 1,
    offsetB: 0,
    lastValue: '—',
  }));
}

function loadRows(): UnitSettingRow[] {
  const defaults = getMountedRows();
  if (typeof window === 'undefined') return defaults;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaults;
  try {
    const parsed = JSON.parse(raw) as Record<
      string,
      Pick<UnitSettingRow, 'readingLabel' | 'unit' | 'scaleA' | 'offsetB'>
    >;
    return defaults.map((row) => ({
      ...row,
      readingLabel: parsed[row.key]?.readingLabel ?? row.readingLabel,
      unit: parsed[row.key]?.unit ?? row.unit,
      scaleA: parsed[row.key]?.scaleA ?? row.scaleA,
      offsetB: parsed[row.key]?.offsetB ?? row.offsetB,
    }));
  } catch {
    return defaults;
  }
}

const SensorReadingsSettings = () => {
  const toast = useToast();
  const [rows, setRows] = useState<UnitSettingRow[]>(() => getDefaultRows());
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<
    Pick<UnitSettingRow, 'readingLabel' | 'unit' | 'scaleA' | 'offsetB'>
  >({
    readingLabel: '',
    unit: '',
    scaleA: 1,
    offsetB: 0,
  });

  // Avoid hydration mismatch: read localStorage only after mount.
  useEffect(() => {
    setRows(loadRows());
  }, []);

  const hasChanges = useMemo(() => {
    return rows.some((row) => {
      const defaults = getDefaultRows().find((d) => d.key === row.key);
      return defaults
        ? defaults.unit !== row.unit ||
            defaults.readingLabel !== row.readingLabel ||
            defaults.scaleA !== row.scaleA ||
            defaults.offsetB !== row.offsetB
        : false;
    });
  }, [rows]);

  const startEdit = (row: UnitSettingRow) => {
    setEditingKey(row.key);
    setDraft({
      readingLabel: row.readingLabel,
      unit: row.unit,
      scaleA: row.scaleA,
      offsetB: row.offsetB,
    });
  };

  const cancelEdit = () => {
    setEditingKey(null);
  };

  const applyEdit = (key: string) => {
    setRows((prev) => {
      const next = prev.map((row) =>
        row.key === key
          ? {
              ...row,
              readingLabel: draft.readingLabel,
              unit: draft.unit,
              scaleA: Number.isFinite(draft.scaleA) ? draft.scaleA : row.scaleA,
              offsetB: Number.isFinite(draft.offsetB)
                ? draft.offsetB
                : row.offsetB,
            }
          : row
      );
      const payload = next.reduce(
        (acc, row) => {
          acc[row.key] = {
            readingLabel: row.readingLabel,
            unit: row.unit,
            scaleA: row.scaleA,
            offsetB: row.offsetB,
          };
          return acc;
        },
        {} as Record<
          string,
          Pick<UnitSettingRow, 'readingLabel' | 'unit' | 'scaleA' | 'offsetB'>
        >
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return next;
    });
    setEditingKey(null);
    toast({
      title: 'Modification enregistrée',
      description: 'La ligne a été sauvegardée localement.',
      status: 'success',
      duration: 1800,
      isClosable: true,
    });
  };

  const editingRow = useMemo(
    () => rows.find((row) => row.key === editingKey) ?? null,
    [rows, editingKey]
  );

  const handleSave = () => {
    const payload = rows.reduce(
      (acc, row) => {
        acc[row.key] = {
          readingLabel: row.readingLabel,
          unit: row.unit,
          scaleA: row.scaleA,
          offsetB: row.offsetB,
        };
        return acc;
      },
      {} as Record<
        string,
        Pick<UnitSettingRow, 'readingLabel' | 'unit' | 'scaleA' | 'offsetB'>
      >
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    toast({
      title: 'Unites enregistrees',
      description: 'Modifications appliquees en frontend uniquement.',
      status: 'success',
      duration: 2500,
      isClosable: true,
    });
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRows(getMountedRows());
    toast({
      title: 'Reinitialise',
      description: 'Les unites par defaut ont ete restaurees.',
      status: 'info',
      duration: 2200,
      isClosable: true,
    });
  };

  return (
    <Box
      overflowX="auto"
      borderRadius="md"
      border="1px solid #e2e8f0"
      bg="white"
    >
      <Table size="md" variant="simple">
        <Thead>
          <Tr bg="#edf2f7">
            <Th>Libellé de la lecture</Th>
            <Th>Type</Th>
            <Th>Unité</Th>
            <Th>Facteur d&apos;échelle (a)</Th>
            <Th>Décalage (b)</Th>
            <Th>Dernière valeur</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row) => (
            <Tr key={row.key}>
              <Td minW="220px">{row.readingLabel}</Td>
              <Td>{row.typeLabel}</Td>
              <Td minW="120px">{row.unit}</Td>
              <Td minW="120px">{row.scaleA}</Td>
              <Td minW="120px">{row.offsetB}</Td>
              <Td>{row.lastValue}</Td>
              <Td>
                <IconButton
                  aria-label="Edit row"
                  size="sm"
                  icon={<FaPen />}
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => startEdit(row)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Flex justify="flex-end" gap={2} mt={4} p={3}>
        <Button size="sm" variant="outline" onClick={handleReset}>
          Reinitialiser
        </Button>
        <Button size="sm" colorScheme="blue" onClick={handleSave}>
          Enregistrer
        </Button>
      </Flex>

      {hasChanges && (
        <Text mt={1} mb={3} ml={3} fontSize="xs" color="orange.500">
          Des unites ont ete modifiees localement.
        </Text>
      )}

      <Modal isOpen={editingRow != null} onClose={cancelEdit} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modifier la lecture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={3}>
              <FormControl>
                <FormLabel>Libellé de la lecture</FormLabel>
                <Input
                  value={draft.readingLabel}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      readingLabel: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Unité</FormLabel>
                <Input
                  value={draft.unit}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, unit: e.target.value }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Facteur d&apos;échelle (a)</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  value={draft.scaleA}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      scaleA: Number(e.target.value),
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Décalage (b)</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  value={draft.offsetB}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      offsetB: Number(e.target.value),
                    }))
                  }
                />
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              leftIcon={<FaTimes />}
              variant="ghost"
              colorScheme="red"
              onClick={cancelEdit}
            >
              Annuler
            </Button>
            <Button
              leftIcon={<FaCheck />}
              colorScheme="blue"
              onClick={() => {
                if (editingRow) applyEdit(editingRow.key);
              }}
            >
              Enregistrer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SensorReadingsSettings;
