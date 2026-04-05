import React, { useMemo, useRef, useState } from 'react';
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
import {
  Box,
  Text,
  Flex,
  HStack,
  Button,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCamera, FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import { calibrateChartValue } from '@/app/utils/chartSeriesCalibration';
import { resolveAxisUnit } from '@/app/utils/unitOverrides';
import { useChartAxisColors } from '@/app/utils/useChartAxisColors';

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
  const { axis, mutedSeries, grid } = useChartAxisColors();
  const brushStroke = useColorModeValue('#8884d8', '#b794f4');
  const unitRev = useUnitOverridesRevision();

  const combinedData = useMemo(
    () =>
      temperatureData.map((t) => {
        const moisturePoint = moistureData.find(
          (m) => m.timestamp === t.timestamp
        );
        return {
          name: t.timestamp,
          leaf_temperature: calibrateChartValue('leaf_temperature', t.value),
          leaf_moisture:
            moisturePoint != null
              ? calibrateChartValue('leaf_moisture', moisturePoint.value)
              : null,
        };
      }),
    [temperatureData, moistureData, unitRev]
  );

  const tempUnit = resolveAxisUnit('leaf_temperature');
  const moistureUnit = resolveAxisUnit('leaf_moisture');

  const labelInterval = useBreakpointValue({
    base: Math.ceil(combinedData.length / 3),
    md: Math.ceil(combinedData.length / 5),
  });

  const _labelAngle = useBreakpointValue({ base: -3, md: 5 });

  const [activeLines, setActiveLines] = useState({
    leaf_temperature: true,
    leaf_moisture: true,
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
        .map((d) => `${d.name},${d.leaf_temperature},${d.leaf_moisture ?? ''}`)
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
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
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
              yAxisId="left"
              label={{
                value: `Température feuille (${tempUnit})`,
                angle: -90,
                position: 'insideLeft',
                fontSize: 14,
                dy: 50,
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
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: `Humidité feuille (${moistureUnit})`,
                angle: -90,
                position: 'insideRight',
                fontSize: 14,
                dy: -50,
              }}
              stroke={axis}
              strokeWidth={1}
              tick={{
                fill: axis,
                fontSize: 17,
                fontFamily: 'Arial, sans-serif',
              }}
              axisLine={{ stroke: axis, strokeWidth: 1 }}
              tickLine={{ stroke: axis, strokeWidth: 1 }}
            />
            <Tooltip content={<UnifiedTooltip valuesAlreadyCalibrated />} />
            <Legend onClick={handleLegendClick} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="leaf_temperature"
              name={`Température feuille (${tempUnit})`}
              stroke={activeLines.leaf_temperature ? '#ff7300' : mutedSeries}
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="leaf_moisture"
              name={`Humidité feuille (${moistureUnit})`}
              stroke={activeLines.leaf_moisture ? '#007aff' : mutedSeries}
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Brush
              dataKey="name"
              height={30}
              stroke={brushStroke}
              travellerWidth={8}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default SensorLeafChart;
