import { Box, Flex, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { SensorData } from '@/app/types';
import { resolveAxisUnit } from '@/app/utils/unitOverrides';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import { formatNumber } from '@/app/utils/formatNumber';
import {
  distanceToBasinPoint,
  rawToMetres,
  resolveBasin,
  type BasinGeometryRect,
} from '@/app/utils/basinVolume';
import dynamic from 'next/dynamic';
import LastDataPanel from '../../common/LastDataPanel';

// three.js Canvas touches DOM-bound React internals at import time, so it
// must load client-side only (Next SSR prerender crashes otherwise).
const BasinCube = dynamic(() => import('./BasinCube'), {
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

// Re-exported so WaterLevelMain/StationMain keep importing from here.
export type BasinGeometry = BasinGeometryRect;

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

const WaterLevelLastData = ({
  data,
  basin,
}: {
  data: SensorData[];
  basin: BasinGeometry;
}) => {
  const t = useTranslations();
  useUnitOverridesRevision();
  const unit = resolveAxisUnit(
    'water_level',
    data[data.length - 1]?.default_unit
  );
  const latest = data[data.length - 1];
  const resolved = resolveBasin(basin);

  const valueColor = useColorModeValue('blue.700', 'blue.200');
  const titleColor = useColorModeValue('gray.600', 'gray.300');
  const dimColor = useColorModeValue('gray.500', 'gray.400');

  const reading = typeof latest?.value === 'number' ? latest.value : null;
  // Captor reports D(t) = sensor -> surface. Convert to metres first.
  const distanceM =
    reading === null ? null : rawToMetres(reading, latest?.default_unit);
  const point =
    distanceM === null ? null : distanceToBasinPoint(distanceM, resolved);

  const waterHeight = point?.hM ?? null;
  const fillPct = point?.fillPct ?? null;
  const capacityL = point?.volumeL ?? null;

  const dash = '—';
  const dims =
    resolved.lengthM != null &&
    resolved.widthM != null &&
    resolved.hTotM != null
      ? `${formatNumber(resolved.lengthM)} × ${formatNumber(
          resolved.widthM
        )} × ${formatNumber(resolved.hTotM)} m`
      : null;

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
          {t('analytics.waterLevel.cardTitle')}
        </Text>

        {/* 3D basin: L x W x H_tot auto-scaled to fit, water from h(t) */}
        <Flex justify="center" my={3} data-basin-visual>
          <Box w="100%" maxW="220px">
            <Box position="relative" w="100%" h="190px">
              <BasinCube
                lengthM={resolved.lengthM}
                widthM={resolved.widthM}
                hTotM={resolved.hTotM}
                hM={waterHeight}
                hMaxM={resolved.hMaxM}
                fillPct={fillPct}
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
                  {fillPct !== null ? `${formatNumber(fillPct)}%` : dash}
                </Text>
              </Flex>
            </Box>
            <Text fontSize="xs" color={dimColor} mt={1}>
              {dims ??
                (resolved.hMaxM != null
                  ? `${t('analytics.waterLevel.maxDepth')}: ${formatNumber(
                      resolved.hMaxM
                    )} m`
                  : dash)}
            </Text>
            {resolved.isRectangle && (
              <Text fontSize="xs" color={dimColor}>
                {t('analytics.waterLevel.sensorToMax')}:{' '}
                {formatNumber(resolved.dMaxM)} m
              </Text>
            )}
          </Box>
        </Flex>

        <VStack spacing={2} align="stretch" w="100%">
          <Row
            label={t('analytics.waterLevel.sensorLevel')}
            value={reading != null ? `${formatNumber(reading)} ${unit}` : dash}
            color={valueColor}
          />
          <Row
            label={t('analytics.waterLevel.waterHeight')}
            value={
              waterHeight != null ? `${formatNumber(waterHeight)} m` : dash
            }
            color={valueColor}
          />
          <Row
            label={t('analytics.waterLevel.capacity')}
            value={capacityL != null ? `${formatNumber(capacityL)} L` : dash}
            color={valueColor}
          />
          <Row
            label={t('analytics.waterLevel.fillPct')}
            value={fillPct != null ? `${formatNumber(fillPct)} %` : dash}
            color={valueColor}
          />
          {resolved.vMaxL != null && (
            <Row
              label={t('analytics.waterLevel.maxCapacity')}
              value={`${formatNumber(resolved.vMaxL)} L`}
              color={valueColor}
            />
          )}
        </VStack>
      </LastDataPanel>
    </Box>
  );
};

export default WaterLevelLastData;
