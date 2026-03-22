import React, { useRef, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { FaDownload, FaCamera } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { SensorData } from '@/app/types';
import { formatNumber } from '@/app/utils/formatNumber';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import ChartLegend from '../../common/ChartLegend';
import {
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultLegendWrapperStyle,
  defaultTooltipCursor,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';

const SolarRadiationChart = ({
  data,
  loading,
}: {
  data: SensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [showArea, setShowArea] = useState(true);

  const chartData = addTimeMsToChartRows(
    data.map((item) => ({
      name: item.timestamp,
      value: item.value,
    })),
    'name'
  );

  const xAxisProps = getAdaptiveTimeXAxisProps(chartData, 'name');
  const yAxisProps = getDefaultYAxisProps(2);
  const { textColor } = useColorModeStyles();

  const handleLegendClick = (payload: any) => {
    if (payload.value === 'Radiation solaire') {
      setShowArea((prev) => !prev);
    }
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'solar_radiation_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      'timestamp,value\n' +
      data.map((d) => `${d.timestamp},${formatNumber(d.value)}`).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'solar_radiation_data.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Rayonnement global
        </Text>
        <HStack spacing={2} flexShrink={0}>
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
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 0, left: 40, bottom: 5 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis
              {...yAxisProps}
              label={{
                value: 'Rayonnement (W/m²)',
                angle: -90,
                dx: -35,
                dy: 60,
                position: 'insideLeft',
                style: { fontSize: 14, fill: '#64748b' },
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
            <Area
              type="monotone"
              dataKey="value"
              name="Radiation solaire"
              stroke={showArea ? '#f6c90e' : 'gray'}
              fill={showArea ? '#f6c90e55' : 'gray'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: 'white' }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default SolarRadiationChart;
