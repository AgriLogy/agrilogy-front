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
import { SensorData } from '@/app/types';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import ChartLegend from '../../common/ChartLegend';
import {
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultLegendWrapperStyle,
  defaultLineProps,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';

const WaterPressureChart = ({
  data,
  loading,
}: {
  data: SensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [showLine, setShowLine] = useState(true);

  const chartData = addTimeMsToChartRows(
    data.map((item) => ({
      name: item.timestamp,
      value: item.value,
    })),
    'name'
  );

  const { textColor } = useColorModeStyles();
  const xAxisProps = getAdaptiveTimeXAxisProps(chartData, 'name');
  const yAxisProps = getDefaultYAxisProps(2);

  const handleLegendClick = (data: any) => {
    if (data.value === 'Consommation') {
      setShowLine((prev) => !prev);
    }
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'WaterPressure_chart.png';
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
    link.download = 'WaterPressure_data.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Évolution du pression d&apos;eau
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
            margin={{ top: 16, right: 0, left: 25, bottom: 0 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis
              {...yAxisProps}
              label={{
                value: '',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 11, fill: '#64748b' },
              }}
            />
            <Tooltip content={<UnifiedTooltip />} />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={<ChartLegend onClick={handleLegendClick} />}
            />
            <Line
              type="monotone"
              dataKey="value"
              name="Pression (bar)"
              stroke={showLine ? '#82ca9d' : 'gray'}
              {...defaultLineProps}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default WaterPressureChart;
