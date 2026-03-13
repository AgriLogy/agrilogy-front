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
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaDownload, FaCamera } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';

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

  const labelInterval = useBreakpointValue({
    base: Math.ceil(Math.max(data.length, 1) / 3),
    md: Math.ceil(Math.max(data.length, 1) / 5),
  });

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
      data.map((d) => `${d.timestamp},${d.vpd}`).join('\n');
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
        empty={data.length === 0}
        chartRef={chartRef}
        height="300px"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              angle={0}
              textAnchor="middle"
              interval={labelInterval}
              stroke="#666"
              strokeWidth={1}
              tick={{
                fill: '#666',
                fontSize: 17,
                fontFamily: 'Arial, sans-serif',
              }}
              axisLine={{ stroke: '#666', strokeWidth: 1 }}
              tickLine={{ stroke: '#666', strokeWidth: 1 }}
            />
            <YAxis
              stroke="#666"
              strokeWidth={1}
              tick={{
                fill: '#666',
                fontSize: 17,
                fontFamily: 'Arial, sans-serif',
              }}
              axisLine={{ stroke: '#666', strokeWidth: 1 }}
              tickLine={{ stroke: '#666', strokeWidth: 1 }}
              label={{
                value: 'VPD (kPa)',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip content={<UnifiedTooltip valueUnit=" kPa" />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="vpd"
              name="VPD (kPa)"
              stroke="#805ad5"
              strokeWidth={2}
              dot={{ r: 4, fill: '#805ad5' }}
              activeDot={{ r: 6, stroke: '#553c9a' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default VPDChart;
