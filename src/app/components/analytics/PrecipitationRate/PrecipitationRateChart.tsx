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
import { formatNumber } from '@/app/utils/formatNumber';
import {
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultBarProps,
  defaultLegendWrapperStyle,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
  defaultTooltipCursor,
} from '@/app/utils/chartAxisConfig';
import ChartStateView from '../../common/ChartStateView';
import ChartLegend from '../../common/ChartLegend';
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
    if (data.value === 'Taux de précipitation (mm/h)') {
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
      data.map((d) => `${d.timestamp},${formatNumber(d.value)}`).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'precipitation_rate_data.csv';
    link.click();

    URL.revokeObjectURL(url);
  };
  const { colorMode } = useColorMode();
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
          Taux de précipitation
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
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 0, left: 35, bottom: 5 }}
            onClick={(_e) => {}}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis
              {...yAxisProps}
              label={{
                value: 'Précipitation (mm/h)',
                angle: -90,
                dx: -30,
                dy: 50,
                position: 'insideLeft',
                style: { fontSize: 12, fill: '#64748b' },
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
            <Bar
              dataKey="value"
              name="Taux de précipitation (mm/h)"
              fill={colorMode === 'dark' ? '#60a5fa' : '#3b82f6'}
              fillOpacity={showBar ? 0.9 : 0.15}
              activeBar={<Rectangle radius={[10, 10, 3, 3]} />}
              {...defaultBarProps}
              style={{
                pointerEvents: showBar ? 'auto' : 'none',
              }}
              hide={!showBar}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default PrecipitationRateChart;
