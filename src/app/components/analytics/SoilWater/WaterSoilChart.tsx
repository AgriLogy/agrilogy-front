import { ComposedChart, Line, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, } from 'recharts'; import { Box, Button, Flex, HStack, Text, useColorModeValue, } from '@chakra-ui/react'; import { useRef, useMemo } from 'react'; import html2canvas from 'html2canvas'; import { FaCamera, FaDownload } from 'react-icons/fa'; import useColorModeStyles from '@/app/utils/useColorModeStyles'; import { ThresholdBand, WaterSoilData } from '@/app/types'; import { formatNumber } from '@/app/utils/formatNumber'; import ChartStateView from '../../common/ChartStateView'; import ChartLegend, { type ChartLegendPayloadEntry, } from '../../common/ChartLegend'; import UnifiedTooltip, { type UnifiedTooltipPayloadItem, } from '../../common/UnifiedTooltip'; import { addTimeMsToChartRows, defaultCartesianGridProps, defaultLegendWrapperStyle,
  defaultTooltipCursor,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
  chartAxisStyles,
} from '@/app/utils/chartAxisConfig';

import { useState } from 'react';

/** Légendes courbes humidité (profondeurs bas / moyen / haut). */
export const SOIL_SERIES_LABELS = {
  low: 'Humidité bas',
  medium: 'Humidité moyen',
  high: 'Humidité haut',
  irrigation: 'Irrigation',
} as const;

// Distinct, accessible palette (WCAG-friendly contrast on white/dark)
const COLORS = {
  soilLow: '#16a34a',
  soilMedium: '#2563eb',
  soilHigh: '#dc2626',
  irrigation: '#1d4ed8',
} as const;

/** Humidité du sol (axe gauche %) : rouge 0→seuil, bleu seuil→fin du domaine. */
const Y_DOMAIN_MAX = 360;
const HUMIDITY_ZONE_SPLIT = 90;

const WaterSoilChart = ({
  data,
  thresholds: _thresholds,
  targetAxis: _targetAxis = 'left',
  loading = false,
}: {
  data: WaterSoilData[];
  thresholds: ThresholdBand;
  targetAxis?: 'left' | 'right';
  loading?: boolean;
}) => {
  void _thresholds;
  const chartRef = useRef<HTMLDivElement>(null);
  const { textColor } = useColorModeStyles();
  const gridStroke = useColorModeValue('#e2e8f0', '#334155');

  const handleScreenshot = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = 'water_soil_data.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleDownloadData = () => {
    const headers = [
      'timestamp',
      'soilLow',
      'soilMedium',
      'soilHigh',
      'waterFlow',
    ];
    const csv =
      headers.join(',') +
      '\n' +
      data
        .map((d) =>
          [
            d.timestamp,
            d.soilLow ?? '',
            d.soilMedium ?? '',
            d.soilHigh ?? '',
            d.waterFlow ?? '',
          ].join(',')
        )
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'water_soil_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const chartData = useMemo(
    () =>
      addTimeMsToChartRows(
        data.map((d) => ({
          ...d,
          _zoneRedTop: HUMIDITY_ZONE_SPLIT,
          _zoneBlueTop: Y_DOMAIN_MAX,
        })),
        'timestamp'
      ),
    [data]
  );

  const xAxisProps = getAdaptiveTimeXAxisProps(chartData, 'timestamp');
  const leftYProps = getDefaultYAxisProps(1);
  const rightYProps = getDefaultYAxisProps(1);

  const tooltipValueFormatter = (
    v: number | string,
    name: string,
    item: UnifiedTooltipPayloadItem
  ) => {
    if (v == null) return '—';
    const num = typeof v === 'number' ? v : Number(v);
    if (Number.isNaN(num)) return String(v);
    const formatted = formatNumber(num, 1);
    const key = String(item.dataKey ?? '');
    if (key === 'waterFlow' || name === SOIL_SERIES_LABELS.irrigation) {
      return formatted;
    }
    return `${formatted} %`;
  };

  const [activeSeries, setActiveSeries] = useState({
    soilLow: true,
    soilMedium: true,
    soilHigh: true,
    waterFlow: true,
  });

  const handleLegendClick = (entry: ChartLegendPayloadEntry) => {
    const dataKey = entry.dataKey ? String(entry.dataKey) : null;
    if (!dataKey) return;
    if (dataKey === 'soilLow') {
      setActiveSeries((prev) => ({ ...prev, soilLow: !prev.soilLow }));
      return;
    }
    if (dataKey === 'soilMedium') {
      setActiveSeries((prev) => ({ ...prev, soilMedium: !prev.soilMedium }));
      return;
    }
    if (dataKey === 'soilHigh') {
      setActiveSeries((prev) => ({ ...prev, soilHigh: !prev.soilHigh }));
      return;
    }
    if (dataKey === 'waterFlow') {
      setActiveSeries((prev) => ({ ...prev, waterFlow: !prev.waterFlow }));
    }
  };

  return (
    <Box
      width="100%"
      height="100%"
      // borderRadius="xl"
      // borderWidth="1px"
      // borderColor={panelBorder}
      // bg={panelBg}
      p={{ base: 3, md: 4 }}
    >
      <Flex
        justify="space-between"
        align={{ base: 'start', sm: 'center' }}
        direction={{ base: 'column', sm: 'row' }}
        gap={3}
        mb={4}
      >
        <Box>
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            fontWeight="bold"
            color={textColor}
            letterSpacing="-0.02em"
          >
            Eau disponible
          </Text>
          <Text fontSize="sm" color="gray.500" mt={0.5}>
            Humidité du sol et irrigation dans le temps
          </Text>
        </Box>
        <HStack spacing={1}>
          <Button
            aria-label="Capture graphique"
            colorScheme="teal"
            variant="ghost"
            size="sm"
            onClick={handleScreenshot}
          >
            <FaCamera />
          </Button>
          <Button
            aria-label="Exporter CSV"
            colorScheme="blue"
            variant="ghost"
            size="sm"
            onClick={handleDownloadData}
          >
            <FaDownload />
          </Button>
        </HStack>
      </Flex>

      <HStack spacing={6} mb={4} flexWrap="wrap" rowGap={3}>
        <HStack
          spacing={2}
          title="Humidité hors plage cible — stress hydrique possible"
        >
          <Box
            w="10px"
            h="10px"
            bg="red.400"
            opacity={0.55}
            borderRadius="sm"
            flexShrink={0}
          />
          <Text fontSize="sm" color={textColor} fontWeight="medium">
            Zone critique (0–{HUMIDITY_ZONE_SPLIT} %)
          </Text>
        </HStack>
        <HStack spacing={2} title="Plage d'humidité recommandée">
          <Box
            w="10px"
            h="10px"
            bg="blue.300"
            opacity={0.65}
            borderRadius="sm"
            flexShrink={0}
          />
          <Text fontSize="sm" color={textColor} fontWeight="medium">
            Zone optimale ({HUMIDITY_ZONE_SPLIT}–{Y_DOMAIN_MAX} %)
          </Text>
        </HStack>
      </HStack>

      <ChartStateView
        loading={loading}
        empty={!data?.length}
        emptyText="Aucune donnée à afficher."
        chartRef={chartRef}
        height={380}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 8, right: 16, left: 12, bottom: 8 }}
          >
            <defs>
              <linearGradient
                id="irrigationGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={COLORS.irrigation}
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor={COLORS.irrigation}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              {...defaultCartesianGridProps}
              vertical={false}
              stroke={gridStroke}
            />
            <XAxis {...xAxisProps} height={36} />
            <YAxis
              yAxisId="left"
              domain={[0, Y_DOMAIN_MAX]}
              {...leftYProps}
              width={52}
              label={{
                value: 'Humidité du sol (%)',
                angle: -90,
                position: 'insideLeft',
                offset: 8,
                dx: -15,
                dy: 60,
                style: {
                  fontSize: 14,
                  fill: chartAxisStyles.tickFill,
                  fontWeight: 600,
                  fontFamily: chartAxisStyles.fontFamily,
                },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 'auto']}
              {...rightYProps}
              width={52}
              label={{
                value: 'irrigation',
                angle: 90,
                position: 'insideRight',
                offset: 8,
                dx: 17,
                dy: 20,
                style: {
                  fontSize: 14,
                  fill: chartAxisStyles.tickFill,
                  fontWeight: 600,
                  fontFamily: chartAxisStyles.fontFamily,
                },
              }}
            />

            {/* Rouge : humidité (axe gauche) de 0 % jusqu’au seuil 90 % */}
            <Area
              type="monotone"
              dataKey="_zoneRedTop"
              baseValue={0}
              fill="#ef4444"
              fillOpacity={0.45}
              stroke="none"
              yAxisId="left"
              isAnimationActive={false}
              legendType="none"
              opacity={0.5}
            />
            {/* Bleu : de 90 % à 360 % (sommet du domaine humidité) */}
            <Area
              type="monotone"
              dataKey="_zoneBlueTop"
              baseValue={HUMIDITY_ZONE_SPLIT}
              fill="#93c5fd"
              stroke="none"
              yAxisId="left"
              isAnimationActive={false}
              legendType="none"
              opacity={0.55}
            />

            <Tooltip
              content={(props: {
                payload?: Array<{ dataKey?: string | number }>;
                active?: boolean;
                label?: string | number;
              }) => {
                const filtered = props.payload?.filter(
                  (p) => !String(p.dataKey ?? '').startsWith('_zone')
                );
                return (
                  <UnifiedTooltip
                    {...props}
                    payload={
                      filtered as UnifiedTooltipPayloadItem[] | undefined
                    }
                    valueFormatter={tooltipValueFormatter}
                  />
                );
              }}
              cursor={defaultTooltipCursor}
            />
            <Legend
              wrapperStyle={{
                ...defaultLegendWrapperStyle,
                paddingTop: 16,
              }}
              content={(props) => {
                const payload = props.payload?.filter(
                  (entry) =>
                    entry.dataKey != null &&
                    !String(entry.dataKey).startsWith('_zone')
                ) as ChartLegendPayloadEntry[] | undefined;
                return (
                  <ChartLegend
                    payload={payload}
                    onClick={handleLegendClick}
                    fontSize={13}
                    iconSize={14}
                  />
                );
              }}
            />

            <Area
              yAxisId="right"
              type="monotone"
              dataKey="waterFlow"
              name={SOIL_SERIES_LABELS.irrigation}
              baseValue={0}
              fill="url(#irrigationGradient)"
              stroke={COLORS.irrigation}
              strokeWidth={2}
              isAnimationActive={false}
              hide={!activeSeries.waterFlow}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="soilLow"
              name={SOIL_SERIES_LABELS.low}
              stroke={COLORS.soilLow}
              connectNulls
              dot={false}
              hide={!activeSeries.soilLow}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: COLORS.soilLow,
                fill: '#fff',
              }}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="soilMedium"
              name={SOIL_SERIES_LABELS.medium}
              stroke={COLORS.soilMedium}
              connectNulls
              dot={false}
              hide={!activeSeries.soilMedium}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: COLORS.soilMedium,
                fill: '#fff',
              }}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="soilHigh"
              name={SOIL_SERIES_LABELS.high}
              stroke={COLORS.soilHigh}
              connectNulls
              dot={false}
              hide={!activeSeries.soilHigh}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: COLORS.soilHigh,
                fill: '#fff',
              }}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default WaterSoilChart;
