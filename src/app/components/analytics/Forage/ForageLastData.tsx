import { Box, Flex, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { SensorData } from '@/app/types';
import { resolveAxisUnit } from '@/app/utils/unitOverrides';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import { formatNumber } from '@/app/utils/formatNumber';
import {
  depthToForagePoint,
  resolveForage,
  type ForageGeometry,
  type ForageStatus,
} from '@/app/utils/forageLevel';
import type { ForageChartRow } from './ForageChart';
import LastDataPanel from '../../common/LastDataPanel';
import dynamic from 'next/dynamic';

// three.js cylinder touches DOM-bound APIs at import time, so it must load
// client-side only (Next SSR prerender crashes otherwise).
const ForageCylinder = dynamic(() => import('./ForageCylinder'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '190px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#718096',
        fontSize: '12px',
      }}
    >
      …
    </div>
  ),
});

const STATUS_COLOR: Record<ForageStatus, string> = {
  high: 'green.600',
  normal: 'blue.600',
  low: 'red.600',
  unknown: 'gray.500',
};

const Row = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => {
  const labelColor = useColorModeValue('gray.500', 'gray.400');
  return (
    <Flex justify="space-between" align="baseline" w="100%">
      <Text fontSize="xs" color={labelColor}>
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="semibold" color={color}>
        {value}
      </Text>
    </Flex>
  );
};

const ForageLastData = ({
  data,
  rows,
  activeIndex,
  forage,
}: {
  data: SensorData[];
  /** Full chart series; the panel follows rows[activeIndex] while playing. */
  rows: ForageChartRow[];
  /** Playhead index into rows (null = latest reading). */
  activeIndex: number | null;
  forage: ForageGeometry;
}) => {
  const t = useTranslations();
  useUnitOverridesRevision();
  const unit = resolveAxisUnit(
    'forage_level',
    data[data.length - 1]?.default_unit
  );
  const latest = data[data.length - 1];
  const resolved = resolveForage(forage);

  const valueColor = useColorModeValue('blue.700', 'blue.200');
  const titleColor = useColorModeValue('gray.600', 'gray.300');
  const dimColor = useColorModeValue('gray.500', 'gray.400');

  // While the animation plays, show the playhead row instead of the latest.
  const activeRow =
    activeIndex != null && rows[activeIndex] != null
      ? rows[activeIndex]
      : (rows[rows.length - 1] ?? null);
  const rawMatch =
    activeRow != null
      ? data.find((d) => d.timestamp === activeRow.timestamp)
      : null;
  const reading =
    rawMatch != null && typeof rawMatch.value === 'number'
      ? rawMatch.value
      : typeof latest?.value === 'number'
        ? latest.value
        : null;
  // Captor reports D(t) = depth to the water surface, displayed as-is.
  const depthM = activeRow != null ? activeRow.depthM : null;
  const point = depthM === null ? null : depthToForagePoint(depthM, resolved);

  const dash = '—';
  const dims =
    resolved.diameterM != null && resolved.totalDepthM != null
      ? `Ø ${formatNumber(resolved.diameterM)} × ${formatNumber(
          resolved.totalDepthM
        )} m`
      : null;

  const statusKey =
    point == null
      ? null
      : point.status === 'high'
        ? t('analytics.forage.statusHigh')
        : point.status === 'low'
          ? t('analytics.forage.statusLow')
          : point.status === 'normal'
            ? t('analytics.forage.statusNormal')
            : t('analytics.forage.statusUnknown');
  const statusColor = point == null ? dimColor : STATUS_COLOR[point.status];

  return (
    <Box
      flex={1}
      minH={0}
      minW={0}
      w="100%"
      alignSelf="stretch"
      display="flex"
      flexDirection="column"
    >
      <LastDataPanel
        variant="et0"
        display="flex"
        flexDirection="column"
        textAlign="center"
        minW="250px"
      >
        <Text
          fontWeight="semibold"
          fontSize="xs"
          letterSpacing="0.08em"
          textTransform="uppercase"
          color={titleColor}
        >
          {t('analytics.forage.cardTitle')}
        </Text>

        {/* 3D borehole: diameter x total depth auto-scaled to fit */}
        <Flex justify="center" my={3} data-forage-visual>
          <Box w="100%" maxW="220px">
            <Box position="relative" w="100%" h="190px">
              <ForageCylinder
                diameterM={resolved.diameterM}
                totalDepthM={resolved.totalDepthM}
                depthM={point?.depthM ?? null}
                highM={resolved.highM}
                lowM={resolved.lowM}
              />
              <Flex
                position="absolute"
                top={1}
                left={0}
                right={0}
                justify="center"
                pointerEvents="none"
              >
                <Text fontSize="md" fontWeight="bold" color={valueColor}>
                  {depthM !== null ? `${formatNumber(depthM)} m` : dash}
                </Text>
              </Flex>
            </Box>
            <Text fontSize="xs" color={dimColor} mt={1}>
              {dims ?? dash}
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={statusColor}>
              {statusKey ?? dash}
            </Text>
          </Box>
        </Flex>

        <VStack spacing={2} align="stretch" w="100%">
          <Row
            label={t('analytics.forage.sensorDepth')}
            value={reading != null ? `${formatNumber(reading)} ${unit}` : dash}
            color={valueColor}
          />
          <Row
            label={t('analytics.forage.waterDepth')}
            value={depthM != null ? `${formatNumber(depthM)} m` : dash}
            color={valueColor}
          />
          <Row
            label={t('analytics.forage.status')}
            value={statusKey ?? dash}
            color={statusColor}
          />
          {resolved.highM != null && (
            <Row
              label={t('analytics.forage.highThreshold')}
              value={`${formatNumber(resolved.highM)} m`}
              color={valueColor}
            />
          )}
          {resolved.lowM != null && (
            <Row
              label={t('analytics.forage.lowThreshold')}
              value={`${formatNumber(resolved.lowM)} m`}
              color={valueColor}
            />
          )}
        </VStack>
      </LastDataPanel>
    </Box>
  );
};

export default ForageLastData;
