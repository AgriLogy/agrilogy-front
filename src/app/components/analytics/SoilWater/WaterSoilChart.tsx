import {
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { FaCamera, FaDownload } from 'react-icons/fa';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { ThresholdBand, WaterSoilData } from '@/app/types';
import { formatNumber } from '@/app/utils/formatNumber';
import ChartStateView from '../../common/ChartStateView';
import ChartLegend, {
  type ChartLegendPayloadEntry,
} from '../../common/ChartLegend';
import UnifiedTooltip, {
  type UnifiedTooltipPayloadItem,
} from '../../common/UnifiedTooltip';
import {
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultBarProps,
  defaultLegendWrapperStyle,
  defaultTooltipCursor,
  getAdaptiveTimeXAxisProps,
  chartAxisStyles,
} from '@/app/utils/chartAxisConfig';

// Series colors matching reference (Prof. 20cm green, 40cm blue, 60cm red, Irrigation dark blue)
const COLORS = {
  soilLow: '#22c55e', // Prof. 20 cm
  soilMedium: '#2563eb', // Prof. 40 cm
  soilHigh: '#ef4444', // Prof. 60 cm
  irrigation: '#1e40af',
} as const;

const WaterSoilChart = ({
  data,
  thresholds,
  targetAxis = 'left',
  loading = false,
}: {
  data: WaterSoilData[];
  thresholds: ThresholdBand;
  targetAxis?: 'left' | 'right';
  loading?: boolean;
}) => {
  const { critical_min, critical_max, normal_min, normal_max } = thresholds;
  const chartRef = useRef<HTMLDivElement>(null);
  const { textColor } = useColorModeStyles();

  const handleScreenshot = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = 'water_soil_data.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleDownloadData = () => {
    const headers = ['timestamp', 'soilLow', 'soilMedium', 'soilHigh', 'waterFlow'];
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

  // Left Y-axis is soil moisture % — domain 0–125. Clamp zone bounds so they draw on the chart.
  const Y_DOMAIN_MAX = 125;
  const clampY = (v: number) => Math.max(0, Math.min(Y_DOMAIN_MAX, v));

  // Zone critique: moisture outside safe range (too dry 0..critical_min, too wet critical_max..max)
  const criticalLowTop = clampY(critical_min);
  const criticalHighBottom = clampY(critical_max);

  // Zone optimale: target moisture range (normal_min..normal_max). If thresholds are in other units and > 125, use a sensible % range.
  const optimalMin = normal_min <= Y_DOMAIN_MAX ? normal_min : 50;
  const optimalMax = normal_max <= Y_DOMAIN_MAX ? normal_max : 100;
  const optimalBottom = clampY(optimalMin);
  const optimalTop = clampY(optimalMax);
  const hasOptimalBand = optimalTop > optimalBottom;

  const hasCriticalLowBand = criticalLowTop > 0;
  const hasCriticalHighBand = criticalHighBottom < Y_DOMAIN_MAX;

  // Augment data with zone band values for Area backgrounds (constant per row)
  const chartData = useMemo(
    () =>
      addTimeMsToChartRows(
        data.map((d) => ({
          ...d,
          _zoneCritLow: criticalLowTop,
          _zoneOptTop: optimalTop,
          _zoneOptBottom: optimalBottom,
          _zoneCritHigh: Y_DOMAIN_MAX,
        })),
        'timestamp'
      ),
    [data, criticalLowTop, optimalTop, optimalBottom]
  );

  const xAxisProps = getAdaptiveTimeXAxisProps(chartData, 'timestamp');

  return (
    <Box width="100%" height="100%">
      <Flex justify="space-between" align="center" mb={1}>
        <Text fontSize="xl" fontWeight="bold" mb={2} color={textColor}>
          Eau disponible
        </Text>
        <HStack spacing={2}>
          <Button
            aria-label="Capture graphique"
            colorScheme="teal"
            variant="ghost"
            onClick={handleScreenshot}
          >
            <FaCamera />
          </Button>
          <Button
            aria-label="Exporter CSV"
            colorScheme="blue"
            variant="ghost"
            onClick={handleDownloadData}
          >
            <FaDownload />
          </Button>
        </HStack>
      </Flex>

      <HStack spacing={4} mb={3} flexWrap="wrap">
        <HStack spacing={2} title="Humidité trop basse ou trop haute — risque pour la culture">
          <Box w="12px" h="12px" bg="#ef4444" opacity={0.5} borderRadius="2px" />
          <Text fontSize="sm" color={textColor}>
            Zone critique (stress hydrique)
          </Text>
        </HStack>
        <HStack spacing={2} title="Plage cible d'humidité du sol pour une bonne croissance">
          <Box w="12px" h="12px" bg="#93c5fd" opacity={0.6} borderRadius="2px" />
          <Text fontSize="sm" color={textColor}>
            Zone optimale ({optimalBottom}–{optimalTop} %)
          </Text>
        </HStack>
      </HStack>

      <ChartStateView
        loading={loading}
        empty={!data?.length}
        emptyText="Aucune donnée à afficher."
        chartRef={chartRef}
        height={340}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 36, right: 56, left: 56, bottom: 45 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis
              yAxisId="left"
              domain={[0, 125]}
              label={{
                value: 'Capacité aux Champs (%)',
                angle: -90,
                position: 'insideLeft',
                dy: 90,
                dx: -50,
                style: { fontSize: 13, fill: chartAxisStyles.tickFill },
              }}
              stroke={chartAxisStyles.axisStroke}
              tick={{
                fill: chartAxisStyles.tickFill,
                fontSize: chartAxisStyles.tickFontSize,
                fontFamily: chartAxisStyles.fontFamily,
              }}
              axisLine={{ stroke: chartAxisStyles.axisStroke, strokeWidth: 1 }}
              tickLine={{ stroke: chartAxisStyles.axisStroke, strokeWidth: 1 }}
              width={40}
              tickMargin={8}
              tickFormatter={(v) => formatNumber(v, 2)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 'auto']}
              label={{
                value: 'Irrigation',
                angle: 90,
                position: 'insideRight',
                dy: 50,
                dx: 50,
                fontSize: 15,
                fontFamily: 'Arial, sans-serif',
              }}
              stroke={chartAxisStyles.axisStroke}
              tick={{
                fill: chartAxisStyles.tickFill,
                fontSize: chartAxisStyles.tickFontSize,
                fontFamily: chartAxisStyles.fontFamily,
              }}
              axisLine={{ stroke: chartAxisStyles.axisStroke, strokeWidth: 1 }}
              tickLine={{ stroke: chartAxisStyles.axisStroke, strokeWidth: 1 }}
              width={48}
              tickMargin={8}
              tickFormatter={(v) => formatNumber(v, 2)}
            />

            {/* Zone bands as Area — render first so they appear behind lines and bars */}
            {hasCriticalLowBand && (
              <Area
                type="monotone"
                dataKey="_zoneCritLow"
                baseValue={0}
                opacity={0.5}
                fill="#ef4444"
                fillOpacity={0.55}
                stroke="none"
                yAxisId="left"
                isAnimationActive={false}
                legendType="none"
              />
            )}
            {hasOptimalBand && (
              <Area
              type="monotone"
              dataKey="_zoneOptTop"
              baseValue={optimalBottom}
              fill="#93c5fd"
              // fillOpacity={0.6}
              stroke="none"
              yAxisId="left"
              isAnimationActive={false}
              legendType="none"
              opacity={0.6}
              />
            )}
            {/* {hasCriticalHighBand && (
              <Area
                type="monotone"
                dataKey="_zoneCritHigh"
                baseValue={criticalHighBottom}
                fill="#ef4444"
                fillOpacity={0.55}
                stroke="none"
                yAxisId="left"
                isAnimationActive={false}
                legendType="none"
              />
            )} */}

            <Tooltip
              content={(props: { payload?: Array<{ dataKey?: string | number }>; active?: boolean; label?: string }) => {
                const filtered = props.payload?.filter(
                  (p) => !String(p.dataKey ?? '').startsWith('_zone')
                );
                return (
                  <UnifiedTooltip
                    {...props}
                    payload={filtered as UnifiedTooltipPayloadItem[] | undefined}
                    valueFormatter={(v) =>
                      v == null ? '—' : formatNumber(Number(v), 2)
                    }
                  />
                );
              }}
              cursor={defaultTooltipCursor}
            />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={(props) => {
                const payload = props.payload?.filter(
                  (entry) =>
                    entry.dataKey != null &&
                    !String(entry.dataKey).startsWith('_zone')
                ) as ChartLegendPayloadEntry[] | undefined;
                return <ChartLegend payload={payload} />;
              }}
            />

            {/* Irrigation: vertical bars (spikes/mountains) on right axis */}
            <Bar
              yAxisId="right"
              dataKey="waterFlow"
              name="Irrigation"
              fill={COLORS.irrigation}
              barSize={8}
              fillOpacity={0.75}
              {...defaultBarProps}
            />

            {/* Soil moisture: smooth lines, no permanent dots */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="soilLow"
              name="Prof. 20 cm"
              stroke={COLORS.soilLow}
              connectNulls
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: 'white' }}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="soilMedium"
              name="Prof. 40 cm"
              stroke={COLORS.soilMedium}
              connectNulls
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: 'white' }}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="soilHigh"
              name="Prof. 60 cm"
              stroke={COLORS.soilHigh}
              connectNulls
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: 'white' }}
              strokeWidth={2}
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
