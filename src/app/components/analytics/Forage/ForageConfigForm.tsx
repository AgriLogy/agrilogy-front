'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import type { ForageGeometry } from '@/app/utils/forageLevel';

const KEY = (zoneId: number | null) =>
  `agrilogy_forage_override_v1_${zoneId ?? 'none'}`;

export function readForageOverride(
  zoneId: number | null
): ForageGeometry | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY(zoneId));
    if (!raw) return null;
    const p = JSON.parse(raw) as Record<string, unknown>;
    const n = (v: unknown) =>
      typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null;
    return {
      diameterM: n(p.diameterM),
      totalDepthM: n(p.totalDepthM),
      highM: n(p.highM),
      lowM: n(p.lowM),
    };
  } catch {
    return null;
  }
}

/**
 * Per-browser fallback for the cylinder dimensions + depth thresholds, used
 * until the admin fills the zone params. Values merge under the zone
 * geometry (zone wins when set).
 */
const ForageConfigForm = ({
  zoneId,
  initial,
  onChange,
}: {
  zoneId: number | null;
  initial: ForageGeometry;
  onChange: (next: ForageGeometry) => void;
}) => {
  const t = useTranslations();
  const [d, setD] = useState(
    initial.diameterM != null ? String(initial.diameterM) : ''
  );
  const [h, setH] = useState(
    initial.totalDepthM != null ? String(initial.totalDepthM) : ''
  );
  const [hi, setHi] = useState(
    initial.highM != null ? String(initial.highM) : ''
  );
  const [lo, setLo] = useState(
    initial.lowM != null ? String(initial.lowM) : ''
  );

  const save = () => {
    const toNum = (s: string) => {
      const v = Number(s.replace(',', '.'));
      return s.trim() !== '' && Number.isFinite(v) && v >= 0 ? v : null;
    };
    const next = {
      diameterM: toNum(d),
      totalDepthM: toNum(h),
      highM: toNum(hi),
      lowM: toNum(lo),
    };
    try {
      localStorage.setItem(KEY(zoneId), JSON.stringify(next));
    } catch {
      /* private mode — ignore */
    }
    onChange(next);
  };

  return (
    <Box
      p={3}
      borderWidth="1px"
      borderRadius="md"
      borderStyle="dashed"
      width="100%"
    >
      <Text fontSize="xs" mb={2}>
        {t('analytics.forage.forageConfigHint')}
      </Text>
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
        <FormControl>
          <FormLabel fontSize="xs">
            {t('analytics.forage.forageDiameter')}
          </FormLabel>
          <Input
            size="sm"
            type="number"
            min={0}
            step="any"
            value={d}
            onChange={(e) => setD(e.target.value)}
            placeholder="0.3"
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="xs">
            {t('analytics.forage.forageTotalDepth')}
          </FormLabel>
          <Input
            size="sm"
            type="number"
            min={0}
            step="any"
            value={h}
            onChange={(e) => setH(e.target.value)}
            placeholder="120"
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="xs">
            {t('analytics.forage.forageHigh')}
          </FormLabel>
          <Input
            size="sm"
            type="number"
            min={0}
            step="any"
            value={hi}
            onChange={(e) => setHi(e.target.value)}
            placeholder="20"
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="xs">{t('analytics.forage.forageLow')}</FormLabel>
          <Input
            size="sm"
            type="number"
            min={0}
            step="any"
            value={lo}
            onChange={(e) => setLo(e.target.value)}
            placeholder="80"
          />
        </FormControl>
      </SimpleGrid>
      <Button size="sm" mt={2} onClick={save}>
        {t('analytics.forage.saveForage')}
      </Button>
    </Box>
  );
};

export default ForageConfigForm;
