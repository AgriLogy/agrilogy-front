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
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { FaCamera, FaDownload } from 'react-icons/fa';
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
  defaultTooltipCursor,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';

type Props = {
  salinityData: SensorData[];
  conductivityData: SensorData[];
  loading: boolean;
};

const SoilSalinityConductivityChart = ({
  salinityData,
  conductivityData,
  loading,
}: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { textColor } = useColorModeStyles();

  const [activeLines, setActiveLines] = useState({
    salinity: true,
    conductivity: true,
  });

  const timestamps = Array.from(
    new Set([
      ...salinityData.map((d) => d.timestamp),
      ...conductivityData.map((d) => d.timestamp),
    ])
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const chartData = addTimeMsToChartRows(
    timestamps.map((timestamp) => {
      const sal = salinityData.find((d) => d.timestamp === timestamp);
      const cond = conductivityData.find((d) => d.timestamp === timestamp);
      return {
        name: timestamp,
        salinity: sal?.value,
        salinity_color: sal?.color,
        salinity_courbe_name: sal?.courbe_name,
        conductivity: cond?.value,
        conductivity_color: cond?.color,
        conductivity_courbe_name: cond?.courbe_name,
      };
    }),
    'name'
  );

  const xAxisProps = getAdaptiveTimeXAxisProps(chartData, 'name');
  const yAxisProps = getDefaultYAxisProps(2);

  const handleLegendClick = (e: any) => {
    const key = e.dataKey;
    setActiveLines((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'soil_salinity_conductivity_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      'timestamp,salinity,conductivity\n' +
      chartData
        .map((d) => `${d.name},${d.salinity ?? ''},${d.conductivity ?? ''}`)
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'soil_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Évolution de la salinité et conductivité du sol
        </Text>
        <HStack spacing={2}>
          <Button onClick={handleScreenshot} variant="ghost" colorScheme="teal">
            <FaCamera />
          </Button>
          <Button
            onClick={handleDownloadData}
            variant="ghost"
            colorScheme="blue"
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
            margin={{ top: 20, right: 0, left: 20, bottom: 0 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis
              {...yAxisProps}
              label={{
                angle: 0,
                position: 'top',
                fontSize: 12,
                dy: 60,
                style: { fill: '#64748b' },
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
              dataKey="salinity"
              name={chartData[0]?.salinity_courbe_name || 'Salinité (mg/l)'}
              stroke={chartData[0]?.salinity_color || '#dba800'}
              strokeOpacity={activeLines.salinity ? 1 : 0.1}
              {...defaultLineProps}
              hide={!activeLines.salinity}
            />

            <Line
              type="monotone"
              dataKey="conductivity"
              name={
                chartData[0]?.conductivity_courbe_name || 'Conductivité (µS/cm)'
              }
              stroke={chartData[0]?.conductivity_color || '#00a86b'}
              strokeOpacity={activeLines.conductivity ? 1 : 0.1}
              {...defaultLineProps}
              hide={!activeLines.conductivity}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default SoilSalinityConductivityChart;
