import React, { useMemo, useRef } from 'react';
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
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultBarProps,
  defaultLegendWrapperStyle,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';
import { formatNumber } from '@/app/utils/formatNumber';
import ChartStateView from '../../common/ChartStateView';
import ChartLegend from '../../common/ChartLegend';
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

  const calculatedByTimestamp = useMemo(
    () => new Map(calculatedData.map((c) => [c.timestamp, c.value])),
    [calculatedData]
  );

  const chartData = addTimeMsToChartRows(
    weatherData.map((item) => {
      const calculated = calculatedByTimestamp.get(item.timestamp);
      return {
        name: item.timestamp,
        Weather: item.value,
        Calculated: calculated ?? null,
      };
    }),
    'name'
  );

  const textColor = useColorModeValue('gray.800', 'gray.200');
  const xAxisProps = getAdaptiveTimeXAxisProps(chartData, 'name');
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
        .map((d) => {
          const w =
            d.Weather == null ? '' : formatNumber(Number(d.Weather));
          const c =
            d.Calculated == null
              ? ''
              : formatNumber(Number(d.Calculated));
          return `${d.name},${w},${c}`;
        })
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
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Évapotranspiration de référence (ET₀)
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
        empty={chartData.length === 0}
        emptyText="Aucune donnée disponible"
        chartRef={chartRef}
        height="300px"
        
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 0, left: 40, bottom: 0 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis
              {...yAxisProps}
              label={{
                value: 'ET₀ (mm)',
                angle: -90,
                dx: -30,
                dy: 20,
                position: 'insideLeft',
                style: { fontSize: 12, fill: '#64748b' },
              }}
            />
            <Tooltip content={<UnifiedTooltip />} />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={<ChartLegend />}
            />
            <Bar
              dataKey="Weather"
              name="ET0 Capteur"
              fill="#3182ce"
              fillOpacity={0.9}
              {...defaultBarProps}
            />
            <Bar
              dataKey="Calculated"
              name="ET0 Calculé"
              fill="#e53e3e"
              fillOpacity={0.85}
              {...defaultBarProps}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default EC0Chart;
