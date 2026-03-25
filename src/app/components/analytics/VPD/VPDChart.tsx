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
import { Box, Flex, Text, Button, HStack, Icon } from '@chakra-ui/react';
import { FaDownload, FaCamera, FaLeaf } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import ChartStateView from '../../common/ChartStateView';
import ChartLegend, { type ChartLegendPayloadEntry } from '../../common/ChartLegend';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { formatNumber } from '@/app/utils/formatNumber';
import {
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultLegendWrapperStyle,
  defaultLineProps,
  defaultTooltipCursor,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';

export interface VPDDataPoint {
  timestamp: string;
  vpd: number;
}

const LEGEND_NAME = 'Déficit de pression de vapeur';
const Y_TICKS = [0, 0.5, 1, 1.5, 2, 2.5] as const;

const VPDChart = ({
  data,
  loading,
}: {
  data: VPDDataPoint[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { textColor } = useColorModeStyles();

  const chartData = addTimeMsToChartRows(data, 'timestamp');
  const xAxisProps = getAdaptiveTimeXAxisProps(chartData, 'timestamp');
  const yAxisProps = getDefaultYAxisProps(1);

  const [showVpd, setShowVpd] = useState(true);

  const handleLegendClick = (entry: ChartLegendPayloadEntry) => {
    if (!entry) return;
    setShowVpd((prev) => !prev);
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'vpd_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      'timestamp,vpd_kpa\n' +
      data.map((d) => `${d.timestamp},${formatNumber(d.vpd)}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vpd_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <HStack spacing={2} align="center">
          <Icon as={FaLeaf} color="green.500" boxSize={5} aria-hidden />
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            Déficit de pression de vapeur
          </Text>
        </HStack>
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
        empty={chartData.length === 0}
        chartRef={chartRef}
        height="340px"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 16, right: 0, left: 15, bottom: 0 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis
              {...yAxisProps}
              domain={[0, 2.5]}
              ticks={[...Y_TICKS]}
              label={{
                value: 'Déficit de pression de vapeur (DPV) (kPa)',
                angle: -90,
                dy: 10,
                dx: -30,
                style: { fontSize: 12, fill: '#64748b' },
              }}
            />
            <Tooltip
              cursor={defaultTooltipCursor}
              content={
                <UnifiedTooltip
                  valueFormatter={(v) => {
                    if (v == null) return '—';
                    const num = typeof v === 'number' ? v : Number(v);
                    return Number.isNaN(num)
                      ? String(v)
                      : `${formatNumber(num, 1)} kPa`;
                  }}
                />
              }
            />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={<ChartLegend onClick={handleLegendClick} />}
            />
            <Line
              type="linear"
              dataKey="vpd"
              name={LEGEND_NAME}
              stroke="#3182ce"
              {...defaultLineProps}
              hide={!showVpd}
              strokeLinejoin="miter"
              strokeLinecap="butt"
              activeDot={{
                r: 5,
                strokeWidth: 2,
                fill: '#3182ce',
                stroke: '#fff',
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default VPDChart;
