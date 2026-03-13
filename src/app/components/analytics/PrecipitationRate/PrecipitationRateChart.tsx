import React, { useRef, useState } from 'react';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  useColorMode,
} from '@chakra-ui/react';
import { FaDownload, FaCamera } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { SensorData } from '@/app/types';
import {
  defaultCartesianGridProps,
  getDefaultXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';

const PrecipitationRateChart = ({
  data,
  loading,
}: {
  data: SensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(true);

  const chartData = data.map((item) => ({
    name: item.timestamp,
    value: item.value,
  }));

  const { textColor } = useColorModeStyles();
  const xAxisProps = getDefaultXAxisProps(chartData, 'name');
  const yAxisProps = getDefaultYAxisProps(2);

  // Legend click handler
  const handleLegendClick = (data: any) => {
    if (data.value === 'Taille des fruits') {
      setShowBar((prev) => !prev);
    }
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'precipitation_rate.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      'timestamp,value\n' +
      data.map((d) => `${d.timestamp},${d.value}`).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'fruit_data.csv';
    link.click();

    URL.revokeObjectURL(url);
  };
  const { colorMode } = useColorMode();
  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Taux de précipitation
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
          <BarChart
            data={chartData}
            margin={{ top: 16, right: 24, left: 8, bottom: 40 }}
            onClick={(_e) => {}}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis
              dataKey="name"
              {...xAxisProps}
              angle={0}
              textAnchor="middle"
              // interval={labelInterval}
            />
            <YAxis
              {...yAxisProps}
              label={{
                value: 'mm/h',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 11, fill: '#64748b' },
              }}
            />
            <Tooltip content={<UnifiedTooltip />} />
            <Legend onClick={handleLegendClick} />
            <Bar
              dataKey="value"
              name="Taux de précipitation (mm/h)"
              fill={colorMode === 'dark' ? '#60a5fa' : '#3b82f6'}
              activeBar={
                <Rectangle
                  fill={showBar ? 'gold' : 'gray'}
                  stroke={showBar ? 'purple' : 'gray'}
                />
              }
              isAnimationActive={false}
              style={{
                pointerEvents: showBar ? 'auto' : 'none',
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default PrecipitationRateChart;
