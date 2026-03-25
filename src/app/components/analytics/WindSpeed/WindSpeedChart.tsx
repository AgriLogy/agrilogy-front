import React, { useRef, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Box, Flex, Text, Button, HStack } from '@chakra-ui/react';
import { FaDownload, FaCamera } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { roundNumber } from '@/app/utils/formatNumber';
import type { WindSpeedSensorRow } from '@/app/utils/windSpeedMerge';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import ChartLegend, {
  type ChartLegendPayloadEntry,
} from '../../common/ChartLegend';
import {
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultLegendWrapperStyle,
  defaultLineProps,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
  defaultTooltipCursor,
} from '@/app/utils/chartAxisConfig';

type WindSpeedRowExtras = WindSpeedSensorRow & {
  gust?: number;
  windGust?: number;
  rafale?: number;
};

/** `wind_gust` from merged gust series, optional separate API, or fields on windspeed rows. */
function pickWindGustKmH(row: WindSpeedRowExtras): number | undefined {
  const o = row as unknown as Record<string, unknown>;
  const keys = [
    'wind_gust',
    'wind_gust_kmh',
    'wind_gust_ms',
    'gust',
    'windGust',
    'rafale',
    'wind_rafale',
    'gust_speed',
    'wind_gust_speed',
  ];
  for (const k of keys) {
    const v = o[k];
    if (v == null) continue;
    const n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

const WindSpeedChart = ({
  data,
  loading,
}: {
  data: WindSpeedSensorRow[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [showLine, setShowLine] = useState(true);
  const [showGust, setShowGust] = useState(true);

  const chartData = addTimeMsToChartRows(
    data.map((item) => {
      const gustRaw = pickWindGustKmH(item);
      return {
        name: item.timestamp,
        value: roundNumber(item.value),
        // Recharts: null = gap; connectNulls joins non-null segments
        wind_gust:
          gustRaw != null && Number.isFinite(gustRaw)
            ? roundNumber(gustRaw)
            : null,
      };
    }),
    'name'
  );

  const { textColor } = useColorModeStyles();
  const xAxisProps = getAdaptiveTimeXAxisProps(chartData, 'name');
  const yAxisProps = getDefaultYAxisProps(2);

  const SPEED_LABEL = 'Vitesse du vent (km/h)';
  const GUST_LABEL = 'Rafale de vent (km/h)';

  const handleLegendClick = (entry: ChartLegendPayloadEntry) => {
    if (entry.value === SPEED_LABEL) {
      setShowLine((prev) => !prev);
    }
    if (entry.value === GUST_LABEL) {
      setShowGust((prev) => !prev);
    }
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'wind_speed_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const hasGust = data.some((d) => pickWindGustKmH(d) != null);
    const header = hasGust
      ? 'timestamp,value,wind_gust\n'
      : 'timestamp,value\n';
    const rows = data.map((d) => {
      const row = `${d.timestamp},${d.value}`;
      const gust = pickWindGustKmH(d);
      return hasGust ? `${row},${gust ?? ''}` : row;
    });
    const csv = header + rows.join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'wind_speed_data.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Évolution de la vitesse du vent
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

      <ChartStateView
        loading={loading}
        empty={data.length === 0}
        chartRef={chartRef}
        height="300px"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 16, right: 0, left: 40, bottom: 5 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis
              {...yAxisProps}
              label={{
                value: 'km/h',
                angle: -90,
                dx: -35,
                dy: 20,
                position: 'insideLeft',
                style: { fontSize: 14, fill: '#64748b' },
              }}
            />
            <Tooltip content={<UnifiedTooltip />} cursor={defaultTooltipCursor} />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={<ChartLegend onClick={handleLegendClick} />}
            />
            <Line
              type="monotone"
              dataKey="value"
              name={SPEED_LABEL}
              stroke={showLine ? '#82ca9d' : 'gray'}
              {...defaultLineProps}
              isAnimationActive={false}
              hide={!showLine}
            />
            <Line
              type="monotone"
              dataKey="wind_gust"
              name={GUST_LABEL}
              {...defaultLineProps}
              stroke={showGust ? '#ed8936' : 'gray'}
              strokeDasharray="5 5"
              isAnimationActive={false}
              connectNulls
              hide={!showGust}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default WindSpeedChart;
