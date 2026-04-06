'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { FaTrash } from 'react-icons/fa';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import {
  type KcProtocolStageRow,
  defaultKcProtocolStages,
} from '@/app/lib/zoneNotificationConfigStorage';

export type KcProtocolTableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialProtocolName: string;
  initialStages: KcProtocolStageRow[];
  onSave: (payload: {
    protocolName: string;
    stages: KcProtocolStageRow[];
  }) => void;
};

function cloneStages(rows: KcProtocolStageRow[]): KcProtocolStageRow[] {
  return rows.map((r) => ({ ...r }));
}

const emptyRow = (): KcProtocolStageRow => ({
  stageName: '',
  durationDays: 30,
  kcStart: 0.35,
  kcEnd: 0.6,
  amountMm: 0,
  active: true,
});

const KcProtocolTableModal: React.FC<KcProtocolTableModalProps> = ({
  isOpen,
  onClose,
  initialProtocolName,
  initialStages,
  onSave,
}) => {
  const { textColor, borderColor, headerBarBorder, mutedTextColor } =
    useColorModeStyles();
  const [protocolName, setProtocolName] = useState('');
  const [stages, setStages] = useState<KcProtocolStageRow[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setProtocolName(initialProtocolName?.trim() || '');
    setStages(
      initialStages?.length > 0
        ? cloneStages(initialStages)
        : cloneStages(defaultKcProtocolStages())
    );
  }, [isOpen, initialProtocolName, initialStages]);

  const totalDurationDays = useMemo(() => {
    return stages.reduce((acc, row) => {
      if (!row.active) return acc;
      const d = Number(row.durationDays);
      return acc + (Number.isFinite(d) && d > 0 ? Math.round(d) : 0);
    }, 0);
  }, [stages]);

  const updateRow = (index: number, patch: Partial<KcProtocolStageRow>) => {
    setStages((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  };

  const removeRow = (index: number) => {
    setStages((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)
    );
  };

  const addRow = () => {
    setStages((prev) => [...prev, emptyRow()]);
  };

  const handleSave = () => {
    onSave({
      protocolName: protocolName.trim() || 'Protocole Kc',
      stages: cloneStages(stages),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      scrollBehavior="inside"
      blockScrollOnMount={false}
    >
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
      <ModalContent
        borderRadius="xl"
        mx={{ base: 2, md: 4 }}
        maxW="min(1100px, 100vw - 16px)"
      >
        <ModalHeader
          pb={2}
          borderBottomWidth="1px"
          borderColor={headerBarBorder}
        >
          <HStack justify="space-between" align="flex-start" pr={10}>
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color={mutedTextColor} fontWeight="normal">
                Nouveau protocole &gt; Météo
              </Text>
              <Text fontSize="md" fontWeight="bold" color={textColor}>
                Table des coefficients Kc
              </Text>
            </VStack>
          </HStack>
          <ModalCloseButton borderRadius="full" />
        </ModalHeader>
        <ModalBody py={4}>
          <FormControl mb={4} maxW="md">
            <FormLabel fontSize="sm" color={textColor}>
              Nom du protocole
            </FormLabel>
            <Input
              value={protocolName}
              onChange={(e) => setProtocolName(e.target.value)}
              placeholder="Protocole météo Pomme"
              borderRadius="lg"
            />
          </FormControl>

          <TableContainer
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            overflowX="auto"
          >
            <Table size="sm" variant="simple">
              <Thead bg="blackAlpha.50" _dark={{ bg: 'whiteAlpha.50' }}>
                <Tr>
                  <Th color={textColor} w="52px">
                    #
                  </Th>
                  <Th color={textColor} minW="120px">
                    Nom du stade
                  </Th>
                  <Th color={textColor} isNumeric minW="100px">
                    Durée (jours)
                  </Th>
                  <Th color={textColor} isNumeric minW="90px">
                    Kc début
                  </Th>
                  <Th color={textColor} isNumeric minW="90px">
                    Kc fin
                  </Th>
                  <Th color={textColor} isNumeric minW="100px">
                    Quantité (mm)
                  </Th>
                  <Th color={textColor} textAlign="center" minW="72px">
                    Actif
                  </Th>
                  <Th w="52px" />
                </Tr>
              </Thead>
              <Tbody>
                {stages.map((row, i) => (
                  <Tr key={i}>
                    <Td color={mutedTextColor} fontWeight="medium">
                      {String(i + 1).padStart(2, '0')}
                    </Td>
                    <Td>
                      <Input
                        size="sm"
                        value={row.stageName}
                        onChange={(e) =>
                          updateRow(i, { stageName: e.target.value })
                        }
                        placeholder="ex. Avril"
                        borderRadius="md"
                      />
                    </Td>
                    <Td>
                      <NumberInput
                        size="sm"
                        min={0}
                        value={row.durationDays}
                        onChange={(_, v) =>
                          updateRow(i, {
                            durationDays: Number.isFinite(v) ? v : 0,
                          })
                        }
                      >
                        <NumberInputField borderRadius="md" />
                      </NumberInput>
                    </Td>
                    <Td>
                      <NumberInput
                        size="sm"
                        min={0}
                        max={2}
                        step={0.05}
                        value={row.kcStart}
                        onChange={(_, v) =>
                          updateRow(i, { kcStart: Number.isFinite(v) ? v : 0 })
                        }
                      >
                        <NumberInputField borderRadius="md" />
                      </NumberInput>
                    </Td>
                    <Td>
                      <NumberInput
                        size="sm"
                        min={0}
                        max={2}
                        step={0.05}
                        value={row.kcEnd}
                        onChange={(_, v) =>
                          updateRow(i, { kcEnd: Number.isFinite(v) ? v : 0 })
                        }
                      >
                        <NumberInputField borderRadius="md" />
                      </NumberInput>
                    </Td>
                    <Td>
                      <NumberInput
                        size="sm"
                        min={0}
                        value={row.amountMm}
                        onChange={(_, v) =>
                          updateRow(i, {
                            amountMm: Number.isFinite(v) ? v : 0,
                          })
                        }
                      >
                        <NumberInputField borderRadius="md" />
                      </NumberInput>
                    </Td>
                    <Td textAlign="center">
                      <Switch
                        colorScheme="green"
                        isChecked={row.active}
                        onChange={(e) =>
                          updateRow(i, { active: e.target.checked })
                        }
                      />
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="Supprimer le stade"
                        icon={<FaTrash />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => removeRow(i)}
                        isDisabled={stages.length <= 1}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          <Button
            mt={3}
            size="sm"
            variant="outline"
            colorScheme="blue"
            borderRadius="full"
            onClick={addRow}
          >
            + Ajouter un stade
          </Button>
        </ModalBody>

        <ModalFooter
          borderTopWidth="1px"
          borderColor={headerBarBorder}
          flexDirection={{ base: 'column-reverse', md: 'row' }}
          alignItems={{ base: 'stretch', md: 'center' }}
          justifyContent="space-between"
          gap={3}
        >
          <IconButton
            aria-label="Retour"
            icon={<ChevronLeftIcon boxSize={6} />}
            variant="outline"
            borderRadius="full"
            onClick={onClose}
          />
          <HStack
            spacing={4}
            flexWrap="wrap"
            justify={{ base: 'center', md: 'flex-end' }}
            w={{ base: 'full', md: 'auto' }}
          >
            <Text fontSize="sm" color={mutedTextColor} whiteSpace="nowrap">
              Durée totale du protocole :{' '}
              <Text as="span" fontWeight="bold" color={textColor}>
                {totalDurationDays}
              </Text>{' '}
              jours
            </Text>
            <Button colorScheme="blue" borderRadius="lg" onClick={handleSave}>
              Enregistrer le protocole
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default KcProtocolTableModal;
