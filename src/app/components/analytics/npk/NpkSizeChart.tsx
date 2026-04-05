import React, { useMemo, useRef, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  CartesianGrid,
} from 'recharts';
import {
  useBreakpointValue,
  Box,
  Flex,
  Text,
  Button,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaDownload, FaCamera } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { NpkSensorData } from '@/app/types';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import {
  formatCalibratedReading,
  resolveAxisUnit,
} from '@/app/utils/unitOverrides';
import { calibratedValueInAxisUnit } from '@/app/utils/calibratedValueInAxisUnit';
import { getCatalogDefaultUnit } from '@/app/utils/sensorCatalog';
import { useChartAxisColors } from '@/app/utils/useChartAxisColors';

const NpkSizeChart = ({
  data,
  loading,
}: {
  data: NpkSensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { textColor } = useColorModeStyles();
  const { axis, mutedSeries, grid } = useChartAxisColors();
  const brushStroke = useColorModeValue('#8884d8', '#b794f4');
  const unitRev = useUnitOverridesRevision();

  const catalogDefault =
    data[data.length - 1]?.default_unit ??
    data[0]?.default_unit ??
    getCatalogDefaultUnit('npk_n');

  const chartData = useMemo(
    () =>
      data.map((item) => {
        const rowDefault = item.default_unit ?? catalogDefault;
        return {
          name: item.timestamp,
          default_unit: item.default_unit,
          nitrogen_value: item.nitrogen_value,
          phosphorus_value: item.phosphorus_value,
          potassium_value: item.potassium_value,
          npk_n: calibratedValueInAxisUnit(
            'npk_n',
            item.nitrogen_value,
            catalogDefault,
            rowDefault
          ),
          npk_p: calibratedValueInAxisUnit(
            'npk_p',
            item.phosphorus_value,
            catalogDefault,
            rowDefault
          ),
          npk_k: calibratedValueInAxisUnit(
            'npk_k',
            item.potassium_value,
            catalogDefault,
            rowDefault
          ),
        };
      }),
    [data, unitRev, catalogDefault]
  );
  const unitN = resolveAxisUnit('npk_n', catalogDefault);
  const unitP = resolveAxisUnit('npk_p', catalogDefault);
  const unitK = resolveAxisUnit('npk_k', catalogDefault);

  const labelInterval = useBreakpointValue({
    base: Math.ceil(chartData.length / 3),
    md: Math.ceil(chartData.length / 5),
  });

  const _labelAngle = useBreakpointValue({ base: -3, md: 5 });

  const [activeLines, setActiveLines] = useState({
    npk_n: true,
    npk_p: true,
    npk_k: true,
  });

  const handleLegendClick = (e: { dataKey?: unknown }) => {
    const key = e.dataKey;
    if (key !== 'npk_n' && key !== 'npk_p' && key !== 'npk_k') return;
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
      'timestamp,npk_n,npk_p,npk_k\n' +
      chartData
        .map((d) => `${d.name},${d.npk_n},${d.npk_p},${d.npk_k}`)
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
                value: `NPK (${catalogDefault})`,
                angle: -90,
                position: 'insideLeft',
                fontSize: 12,
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
            <Tooltip
              content={
                <UnifiedTooltip
                  valueFormatter={(value, _name, item) => {
                    const p = item.payload as
                      | {
                          nitrogen_value?: number;
                          phosphorus_value?: number;
                          potassium_value?: number;
                          default_unit?: string;
                        }
                      | undefined;
                    const fallback =
                      typeof p?.default_unit === 'string'
                        ? p.default_unit
                        : catalogDefault;
                    const dk = item.dataKey;
                    if (
                      dk === 'npk_n' &&
                      typeof p?.nitrogen_value === 'number' &&
                      Number.isFinite(p.nitrogen_value)
                    ) {
                      return `${formatCalibratedReading('npk_n', p.nitrogen_value)} ${resolveAxisUnit('npk_n', fallback)}`.trim();
                    }
                    if (
                      dk === 'npk_p' &&
                      typeof p?.phosphorus_value === 'number' &&
                      Number.isFinite(p.phosphorus_value)
                    ) {
                      return `${formatCalibratedReading('npk_p', p.phosphorus_value)} ${resolveAxisUnit('npk_p', fallback)}`.trim();
                    }
                    if (
                      dk === 'npk_k' &&
                      typeof p?.potassium_value === 'number' &&
                      Number.isFinite(p.potassium_value)
                    ) {
                      return `${formatCalibratedReading('npk_k', p.potassium_value)} ${resolveAxisUnit('npk_k', fallback)}`.trim();
                    }
                    const n = typeof value === 'number' ? value : Number(value);
                    return Number.isFinite(n)
                      ? n.toFixed(2)
                      : String(value ?? '—');
                  }}
                />
              }
            />
            <Legend onClick={handleLegendClick} />

            <Line
              type="monotone"
              dataKey="npk_n"
              name={`${data[0]?.nitrogen_courbe_name || 'Azote (N)'} (${unitN})`}
              stroke={
                activeLines.npk_n
                  ? data[0]?.nitrogen_color || '#dba800'
                  : mutedSeries
              }
              strokeOpacity={activeLines.npk_n ? 1 : 0.2}
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="npk_p"
              name={`${data[0]?.phosphorus_courbe_name || 'Phosphore (P)'} (${unitP})`}
              stroke={
                activeLines.npk_p
                  ? data[0]?.phosphorus_color || '#00a86b'
                  : mutedSeries
              }
              strokeOpacity={activeLines.npk_p ? 1 : 0.2}
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="npk_k"
              name={`${data[0]?.potassium_courbe_name || 'Potassium (K)'} (${unitK})`}
              stroke={
                activeLines.npk_k
                  ? data[0]?.potassium_color || '#4682b4'
                  : mutedSeries
              }
              strokeOpacity={activeLines.npk_k ? 1 : 0.2}
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

export default NpkSizeChart;
