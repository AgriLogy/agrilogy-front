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
  Brush,
} from 'recharts';
import { Box, Text, Flex, HStack, Button } from '@chakra-ui/react';
import { FaCamera, FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import {
  defaultCartesianGridProps,
  defaultTooltipCursor,
  getDefaultXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';

type SensorData = { timestamp: string; value: number };

const SensorLeafChart = ({
  temperatureData,
  moistureData,
  loading,
}: {
  temperatureData: SensorData[];
  moistureData: SensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { textColor } = useColorModeStyles();

  const combinedData = temperatureData.map((t) => {
    const moisturePoint = moistureData.find((m) => m.timestamp === t.timestamp);
    return {
      name: t.timestamp,
      temperature: t.value,
      moisture: moisturePoint?.value ?? null,
    };
  });

  const xAxisProps = getDefaultXAxisProps(combinedData, 'name');
  const yAxisProps = getDefaultYAxisProps(2);

  const [activeLines, setActiveLines] = useState({
    temperature: true,
    moisture: true,
  });

  const handleLegendClick = (e: any) => {
    const key = e.dataKey as keyof typeof activeLines;
    setActiveLines((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'leaf_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      'timestamp,temperature,moisture\n' +
      combinedData
        .map((d) => `${d.name},${d.temperature},${d.moisture}`)
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leaf_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Évolution de l&apos;humidité et de la température des feuilles
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
        empty={combinedData.length === 0}
        chartRef={chartRef}
        height="300px"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={combinedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
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
              yAxisId="left"
              {...yAxisProps}
              label={{
                value: 'Température (°C)',
                angle: -90,
                position: 'insideLeft',
                fontSize: 12,
                dy: 50,
                style: { fill: '#64748b' },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              {...yAxisProps}
              label={{
                value: 'Humidité (%)',
                angle: -90,
                position: 'insideRight',
                fontSize: 12,
                dy: -50,
                style: { fill: '#64748b' },
              }}
            />
            <Tooltip
              content={<UnifiedTooltip />}
              cursor={defaultTooltipCursor}
            />
            <Legend onClick={handleLegendClick} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              name="Température (°C)"
              stroke={activeLines.temperature ? '#ff7300' : 'gray'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: 'white' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="moisture"
              name="Humidité des feuilles (%)"
              stroke={activeLines.moisture ? '#007aff' : 'gray'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: 'white' }}
            />
            <Brush
              dataKey="name"
              height={30}
              stroke="#8884d8"
              travellerWidth={8}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default SensorLeafChart;
