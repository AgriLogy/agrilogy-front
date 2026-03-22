import React, { useRef } from 'react';
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
import ChartStateView from '../../common/ChartStateView';
import ChartLegend from '../../common/ChartLegend';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { formatNumber } from '@/app/utils/formatNumber';
import {
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultLegendWrapperStyle,
  defaultLineProps,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';

export interface VPDDataPoint {
  timestamp: string;
  vpd: number;
}

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
  const yAxisProps = getDefaultYAxisProps(2);

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
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Déficit de pression de vapeur (VPD)
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
        empty={chartData.length === 0}
        chartRef={chartRef}
        height="300px"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 16, right: 0, left: 60, bottom: 10 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis
              {...yAxisProps}
              label={{
                value: 'Déficit de pression de vapeur (DPV) (kPa)',
                angle: -90,
                dx: -50,
                dy: 140,
                position: 'insideLeft',
                style: { fontSize: 12, fill: '#64748b' },
              }}
            />
            <Tooltip content={<UnifiedTooltip valueUnit=" kPa" />} />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={<ChartLegend />}
            />
            <Line
              type="monotone"
              dataKey="vpd"
              name="Déficit de pression de vapeur (kPa)"
              stroke="#3182ce"
              {...defaultLineProps}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default VPDChart;
