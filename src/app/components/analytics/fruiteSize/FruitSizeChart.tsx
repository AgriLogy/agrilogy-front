import React, { useMemo, useRef, useState } from 'react';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import { calibrateChartValue } from '@/app/utils/chartSeriesCalibration';
import { resolveAxisUnit } from '@/app/utils/unitOverrides';
import { useChartAxisColors } from '@/app/utils/useChartAxisColors';

const FruitSizeChart = ({
  data,
  loading,
}: {
  data: SensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(true);
  const unitRev = useUnitOverridesRevision();

  const chartData = useMemo(
    () =>
      data.map((item) => ({
        name: item.timestamp,
        fruit_size: calibrateChartValue('fruit_size', item.value),
        default_unit: item.default_unit,
      })),
    [data, unitRev]
  );

  const labelInterval = useBreakpointValue({
    base: Math.ceil(chartData.length / 3),
    md: Math.ceil(chartData.length / 5),
  });

  const _labelAngle = useBreakpointValue({ base: -3, md: 5 });
  const { textColor } = useColorModeStyles();
  const { axis, mutedSeries } = useChartAxisColors();
  const fruitUnit = resolveAxisUnit('fruit_size', data[0]?.default_unit);

  const handleLegendClick = (payload: { dataKey?: unknown }) => {
    if (payload?.dataKey === 'fruit_size') {
      setShowBar((prev) => !prev);
    }
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'fruit_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      'timestamp,fruit_size\n' +
      chartData.map((d) => `${d.name},${d.fruit_size}`).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'fruit_data.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Évolution de la taille des fruits
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
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onClick={() => {}}
          >
            <XAxis
              dataKey="name"
              angle={0}
              textAnchor="middle"
              interval={labelInterval}
              stroke={axis}
              strokeWidth={1}
              tick={{
                fill: axis,
                fontSize: 17,
                fontFamily: 'Arial, sans-serif',
              }}
              axisLine={{
                stroke: axis,
                strokeWidth: 1,
              }}
              tickLine={{
                stroke: axis,
                strokeWidth: 1,
              }}
            />
            <YAxis
              label={{
                value: fruitUnit,
                angle: -90,
                position: 'insideLeft',
              }}
              stroke={axis}
              strokeWidth={1}
              tick={{
                fill: axis,
                fontSize: 17,
                fontFamily: 'Arial, sans-serif',
              }}
              axisLine={{
                stroke: axis,
                strokeWidth: 1,
              }}
              tickLine={{
                stroke: axis,
                strokeWidth: 1,
              }}
            />
            <Tooltip content={<UnifiedTooltip valuesAlreadyCalibrated />} />
            <Legend onClick={handleLegendClick} />
            <Bar
              dataKey="fruit_size"
              name={`Taille des fruits (${fruitUnit})`}
              fill={showBar ? '#82ca9d' : mutedSeries}
              activeBar={
                <Rectangle
                  fill={showBar ? 'gold' : mutedSeries}
                  stroke={showBar ? 'purple' : mutedSeries}
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

export default FruitSizeChart;
