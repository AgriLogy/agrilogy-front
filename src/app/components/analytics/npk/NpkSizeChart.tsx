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
import { NpkSensorData } from '@/app/types';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import ChartLegend from '../../common/ChartLegend';
import {
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultLegendWrapperStyle,
  defaultLineProps,
  defaultTooltipCursor,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';

const NpkSizeChart = ({
  data,
  loading,
}: {
  data: NpkSensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { textColor } = useColorModeStyles();

  const chartData = addTimeMsToChartRows(
    data.map((item) => ({
      name: item.timestamp,
      nitrogen: item.nitrogen_value,
      phosphorus: item.phosphorus_value,
      potassium: item.potassium_value,
    })),
    'name'
  );

  const xAxisProps = getAdaptiveTimeXAxisProps(chartData, 'name');
  const yAxisProps = getDefaultYAxisProps(2);

  const [activeLines, setActiveLines] = useState({
    nitrogen: true,
    phosphorus: true,
    potassium: true,
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
      link.download = 'npk_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      'timestamp,nitrogen,phosphorus,potassium\n' +
      data
        .map(
          (d) =>
            `${d.timestamp},${d.nitrogen_value},${d.phosphorus_value},${d.potassium_value}`
        )
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'npk_data.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Évolution des éléments NPK
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
            margin={{ top: 20, right: 0, left: 30, bottom: 0 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis
              {...yAxisProps}
              width={56}
              label={{
                value: 'Concentration (mg/kg)',
                angle: -90,
                position: 'insideLeft',
                fontSize: 14,
                dy: 90,
                dx: -20,
                fontFamily: 'Arial, sans-serif',
                fill: '#64748b',
              }}
            />
            <Tooltip
              content={<UnifiedTooltip />}
              cursor={defaultTooltipCursor}
            />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={<ChartLegend onClick={handleLegendClick} />}
            />

            <Line
              type="monotone"
              dataKey="nitrogen"
              name={data[0]?.nitrogen_courbe_name || 'Azote N (mg/kg)'}
              stroke={
                activeLines.nitrogen
                  ? data[0]?.nitrogen_color || '#dba800'
                  : 'gray'
              }
              {...defaultLineProps}
              hide={!activeLines.nitrogen}
            />
            <Line
              type="monotone"
              dataKey="phosphorus"
              name={data[0]?.phosphorus_courbe_name || 'Phosphore P (mg/kg)'}
              stroke={
                activeLines.phosphorus
                  ? data[0]?.phosphorus_color || '#00a86b'
                  : 'gray'
              }
              {...defaultLineProps}
              hide={!activeLines.phosphorus}
            />
            <Line
              type="monotone"
              dataKey="potassium"
              name={data[0]?.potassium_courbe_name || 'Potassium K (mg/kg)'}
              stroke={
                activeLines.potassium
                  ? data[0]?.potassium_color || '#4682b4'
                  : 'gray'
              }
              {...defaultLineProps}
              hide={!activeLines.potassium}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default NpkSizeChart;
