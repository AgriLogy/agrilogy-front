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
  Button,
  Flex,
  HStack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCamera, FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { SensorData } from '@/app/types';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import { calibrateChartValue } from '@/app/utils/chartSeriesCalibration';
import { resolveAxisUnit } from '@/app/utils/unitOverrides';
import { useChartAxisColors } from '@/app/utils/useChartAxisColors';

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
  const { axis, grid } = useChartAxisColors();
  const brushStroke = useColorModeValue('#8884d8', '#b794f4');
  const unitRev = useUnitOverridesRevision();

  const [activeLines, setActiveLines] = useState({
    soil_salinity: true,
    soil_conductivity: true,
  });

  const labelInterval = useBreakpointValue({
    base: Math.ceil(Math.max(salinityData.length, conductivityData.length) / 3),
    md: Math.ceil(Math.max(salinityData.length, conductivityData.length) / 5),
  });
  // const _labelAngle = useBreakpointValue({ base: -15, md: 15 });
  const _labelAngle = useBreakpointValue({ base: -3, md: 5 });

  const chartData = useMemo(() => {
    const timestamps = Array.from(
      new Set([
        ...salinityData.map((d) => d.timestamp),
        ...conductivityData.map((d) => d.timestamp),
      ])
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return timestamps.map((timestamp) => {
      const sal = salinityData.find((d) => d.timestamp === timestamp);
      const cond = conductivityData.find((d) => d.timestamp === timestamp);
      const sv = sal?.value;
      const cv = cond?.value;
      return {
        name: timestamp,
        soil_salinity:
          sv != null && Number.isFinite(sv)
            ? calibrateChartValue('soil_salinity', sv)
            : null,
        salinity_color: sal?.color,
        salinity_courbe_name: sal?.courbe_name,
        soil_conductivity:
          cv != null && Number.isFinite(cv)
            ? calibrateChartValue('soil_conductivity', cv)
            : null,
        conductivity_color: cond?.color,
        conductivity_courbe_name: cond?.courbe_name,
      };
    });
  }, [salinityData, conductivityData, unitRev]);

  const salinityUnit = resolveAxisUnit(
    'soil_salinity',
    salinityData[0]?.default_unit
  );
  const conductivityUnit = resolveAxisUnit(
    'soil_conductivity',
    conductivityData[0]?.default_unit
  );

  const handleLegendClick = (e: { dataKey?: unknown }) => {
    const key = e.dataKey as keyof typeof activeLines | undefined;
    if (key === 'soil_salinity' || key === 'soil_conductivity') {
      setActiveLines((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
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
      'timestamp,soil_salinity,soil_conductivity\n' +
      chartData
        .map(
          (d) =>
            `${d.name},${d.soil_salinity ?? ''},${d.soil_conductivity ?? ''}`
        )
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
              yAxisId="salinity"
              label={{
                value: salinityUnit,
                angle: -90,
                position: 'insideLeft',
                fontSize: 14,
                dy: 80,
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
              yAxisId="conductivity"
              orientation="right"
              label={{
                value: conductivityUnit,
                angle: 90,
                position: 'insideRight',
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
            <Tooltip content={<UnifiedTooltip valuesAlreadyCalibrated />} />
            <Legend onClick={handleLegendClick} />

            <Line
              yAxisId="salinity"
              type="monotone"
              dataKey="soil_salinity"
              name={`${chartData[0]?.salinity_courbe_name ?? 'Salinité'} (${salinityUnit})`}
              stroke={chartData[0]?.salinity_color || '#dba800'}
              strokeOpacity={activeLines.soil_salinity ? 1 : 0.1}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />

            <Line
              yAxisId="conductivity"
              type="monotone"
              dataKey="soil_conductivity"
              name={`${chartData[0]?.conductivity_courbe_name ?? 'Conductivité'} (${conductivityUnit})`}
              stroke={chartData[0]?.conductivity_color || '#00a86b'}
              strokeOpacity={activeLines.soil_conductivity ? 1 : 0.1}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />

            <Brush
              y={238}
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

export default SoilSalinityConductivityChart;
