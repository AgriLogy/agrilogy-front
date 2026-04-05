import React, { useMemo, useRef, useState } from 'react';
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
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useBreakpointValue,
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

const SolarRadiationChart = ({
  data,
  loading,
}: {
  data: SensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [showArea, setShowArea] = useState(true);
  const unitRev = useUnitOverridesRevision();

  const chartData = useMemo(
    () =>
      [...data]
        .sort((a, b) => {
          const ta = Date.parse(a.timestamp);
          const tb = Date.parse(b.timestamp);
          if (!Number.isFinite(ta) || !Number.isFinite(tb)) return 0;
          return ta - tb;
        })
        .map((item) => ({
          name: item.timestamp,
          // Raw API = W/m². Use catalog dataKey so tooltip units match lecture overrides.
          solar_radiation: calibrateChartValue('solar_radiation', item.value),
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
  const { axis, mutedSeries, grid } = useChartAxisColors();
  const solarUnit = resolveAxisUnit('solar_radiation', data[0]?.default_unit);

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
      'timestamp,solar_radiation\n' +
      chartData.map((d) => `${d.name},${d.solar_radiation}`).join('\n');

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
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          {/* Évolution de la radiation solaire */}
          Rayonnement global
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
          <AreaChart
            data={chartData}
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
              label={{
                value: solarUnit,
                angle: -90,
                fontSize: 16,
                dy: 80,
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
            <Area
              type="monotone"
              dataKey="solar_radiation"
              name={`Radiation solaire (${solarUnit})`}
              stroke={showArea ? '#f6c90e' : mutedSeries}
              fill={showArea ? '#f6c90e' : mutedSeries}
              fillOpacity={showArea ? 0.35 : 0.2}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default SolarRadiationChart;
