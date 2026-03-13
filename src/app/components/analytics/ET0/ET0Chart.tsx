import React, { useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Box,
  Text,
  useColorModeValue,
  Button,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { FaDownload, FaCamera } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import {
  defaultCartesianGridProps,
  getDefaultXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';

interface Et0Data {
  timestamp: string;
  value: number;
  default_unit: string;
}

const EC0Chart = ({
  weatherData,
  calculatedData,
  loading,
}: {
  weatherData: Et0Data[];
  calculatedData: Et0Data[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const chartData = weatherData.map((item, index) => {
    const calculated = calculatedData[index]?.value ?? null;
    return {
      name: item.timestamp,
      Weather: item.value,
      Calculated: calculated,
    };
  });

  const textColor = useColorModeValue('gray.800', 'gray.200');
  const xAxisProps = getDefaultXAxisProps(chartData, 'name');
  const yAxisProps = getDefaultYAxisProps(2);

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'et0_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      'timestamp,Weather,Calculated\n' +
      chartData
        .map((d) => `${d.name},${d.Weather ?? ''},${d.Calculated ?? ''}`)
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'et0_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          ET0
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
        emptyText="Aucune donnée disponible"
        chartRef={chartRef}
        height="300px"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 16, right: 24, left: 8, bottom: 40 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis
              dataKey="name"
              {...xAxisProps}
              angle={0}
              textAnchor="middle"
              // interval={labelInterval}
            />
            <YAxis {...yAxisProps} />
            <Tooltip content={<UnifiedTooltip />} />
            <Legend />
            <Bar dataKey="Weather" fill="#3182ce" name="ET0 Capteur" />
            <Bar dataKey="Calculated" fill="#e53e3e" name="ET0 Calculé" />
          </BarChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default EC0Chart;
