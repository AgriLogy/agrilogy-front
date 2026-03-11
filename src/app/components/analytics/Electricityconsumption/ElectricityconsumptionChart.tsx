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
import {
  useBreakpointValue,
  Box,
  Flex,
  Text,
  Button,
  HStack,
} from '@chakra-ui/react';
import { FaDownload, FaCamera } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { SensorData } from '@/app/types';
import ChartStateView from '../../common/ChartStateView';
import useColorModeStyles from '@/app/utils/useColorModeStyles';

const ElectricityconsumptionChart = ({
  data,
  loading,
}: {
  data: SensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [showLine, setShowLine] = useState(true);

  const chartData = data.map((item) => ({
    name: item.timestamp,
    value: item.value,
  }));

  const labelInterval = useBreakpointValue({
    base: Math.ceil(chartData.length / 3),
    md: Math.ceil(chartData.length / 5),
  });

  const _labelAngle = useBreakpointValue({ base: -3, md: 5 });
  const { textColor } = useColorModeStyles();

  const handleLegendClick = (data: any) => {
    if (data.value === 'Consommation') {
      setShowLine((prev) => !prev);
    }
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'electricity_chart.png';
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
    link.download = 'electricity_data.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Évolution de la consommation électrique
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
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
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
              label={{
                angle: -90,
                fontSize: 16,
                dy: 80,
                position: 'insideLeft',
              }}
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
            <Tooltip />
            <Legend onClick={handleLegendClick} />
            <Line
              type="monotone"
              dataKey="value"
              name="consommation (kWh)"
              stroke={showLine ? '#82ca9d' : 'gray'}
              strokeWidth={2}
              dot={{ r: 4, fill: showLine ? '#82ca9d' : 'gray' }}
              activeDot={{ r: 6, stroke: showLine ? '#2f855a' : 'gray' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default ElectricityconsumptionChart;
