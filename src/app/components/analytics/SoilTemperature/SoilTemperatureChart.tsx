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
  ReferenceArea, // ⬅️ add this
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
import { TemperaturePoint } from './SoilTemperatureMain';

/** Normalized Y-axis space (catalog default for soil temperature). */
const SOIL_TEMP_AXIS_UNIT = getCatalogDefaultUnit('soil_temp_low') || '°C';

const SoilTemperatureChart = ({
  data,
  loading,
  bestValueMin,
  bestValueMax,
}: {
  data: TemperaturePoint[];
  loading: boolean;
  bestValueMin: number;
  bestValueMax: number;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const unitRev = useUnitOverridesRevision();

  const [showLow, setShowLow] = useState(true);
  const [showMedium, setShowMedium] = useState(true);
  const [showHigh, setShowHigh] = useState(true);

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        name: d.timestamp,
        rawLow: d.low,
        rawMedium: d.medium,
        rawHigh: d.high,
        low:
          d.low != null && Number.isFinite(d.low)
            ? calibratedValueInAxisUnit(
                'soil_temp_low',
                d.low,
                SOIL_TEMP_AXIS_UNIT,
                SOIL_TEMP_AXIS_UNIT
              )
            : d.low,
        medium:
          d.medium != null && Number.isFinite(d.medium)
            ? calibratedValueInAxisUnit(
                'soil_temp_medium',
                d.medium,
                SOIL_TEMP_AXIS_UNIT,
                SOIL_TEMP_AXIS_UNIT
              )
            : d.medium,
        high:
          d.high != null && Number.isFinite(d.high)
            ? calibratedValueInAxisUnit(
                'soil_temp_high',
                d.high,
                SOIL_TEMP_AXIS_UNIT,
                SOIL_TEMP_AXIS_UNIT
              )
            : d.high,
      })),
    [data, unitRev]
  );

  const bandY1 = useMemo(
    () =>
      typeof bestValueMin === 'number' && Number.isFinite(bestValueMin)
        ? calibratedValueInAxisUnit(
            'soil_temp_medium',
            bestValueMin,
            SOIL_TEMP_AXIS_UNIT,
            SOIL_TEMP_AXIS_UNIT
          )
        : bestValueMin,
    [bestValueMin, unitRev]
  );
  const bandY2 = useMemo(
    () =>
      typeof bestValueMax === 'number' && Number.isFinite(bestValueMax)
        ? calibratedValueInAxisUnit(
            'soil_temp_medium',
            bestValueMax,
            SOIL_TEMP_AXIS_UNIT,
            SOIL_TEMP_AXIS_UNIT
          )
        : bestValueMax,
    [bestValueMax, unitRev]
  );

  const labelInterval = useBreakpointValue({
    base: Math.ceil(Math.max(chartData.length, 1) / 3),
    md: Math.ceil(Math.max(chartData.length, 1) / 5),
  });

  const _labelAngle = useBreakpointValue({ base: -3, md: 5 });
  const { textColor } = useColorModeStyles();
  const { axis, mutedSeries, grid } = useChartAxisColors();

  const bandFill = useColorModeValue(
    'rgba(72,187,120,0.18)',
    'rgba(72,187,120,0.28)'
  ); // green
  const bandStroke = useColorModeValue(
    'rgba(56,161,105,0.8)',
    'rgba(154,230,180,0.9)'
  );

  const handleLegendClick = (e: any) => {
    switch (e.value) {
      case 'Basse':
        setShowLow((s) => !s);
        break;
      case 'Moyenne':
        setShowMedium((s) => !s);
        break;
      case 'Haute':
        setShowHigh((s) => !s);
        break;
      default:
        break;
    }
  };

  const handleScreenshot = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const a = document.createElement('a');
    a.download = 'soil_temperature_chart.png';
    a.href = canvas.toDataURL();
    a.click();
  };

  const handleDownloadData = () => {
    const header = 'timestamp,low,medium,high\n';
    const rows = data
      .map(
        (d) => `${d.timestamp},${d.low ?? ''},${d.medium ?? ''},${d.high ?? ''}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'soil_temperature_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const xStart = chartData[0]?.name;
  const xEnd = chartData[chartData.length - 1]?.name;
  const showBand =
    typeof bandY1 === 'number' &&
    typeof bandY2 === 'number' &&
    bandY1 < bandY2 &&
    xStart &&
    xEnd;

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Température du sol ({SOIL_TEMP_AXIS_UNIT})
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

            {/* Y-band for ideal irrigation temperature */}
            {showBand && (
              <ReferenceArea
                x1={xStart}
                x2={xEnd}
                y1={bandY1}
                y2={bandY2}
                fill={bandFill}
                stroke={bandStroke}
                strokeOpacity={1}
                ifOverflow="extendDomain"
              />
            )}

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
                value: SOIL_TEMP_AXIS_UNIT,
                angle: -90,
                position: 'insideLeft',
              }}
              domain={['auto', 'auto']}
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
                  valueFormatter={(_value, _name, item) => {
                    const p = item.payload as Record<string, unknown>;
                    const dk = String(item.dataKey ?? '');
                    const spec =
                      dk === 'low'
                        ? { key: 'soil_temp_low' as const, raw: 'rawLow' }
                        : dk === 'medium'
                          ? {
                              key: 'soil_temp_medium' as const,
                              raw: 'rawMedium',
                            }
                          : dk === 'high'
                            ? { key: 'soil_temp_high' as const, raw: 'rawHigh' }
                            : null;
                    if (spec) {
                      const r = p[spec.raw];
                      if (typeof r === 'number' && Number.isFinite(r)) {
                        return `${formatCalibratedReading(spec.key, r)} ${resolveAxisUnit(spec.key)}`.trim();
                      }
                    }
                    const n =
                      typeof _value === 'number' ? _value : Number(_value);
                    return Number.isFinite(n)
                      ? n.toFixed(2)
                      : String(_value ?? '—');
                  }}
                />
              }
            />
            <Legend onClick={handleLegendClick} />

            <Line
              type="monotone"
              dataKey="low"
              name="Basse"
              stroke={showLow ? '#3182CE' : mutedSeries}
              strokeWidth={2}
              dot={{ r: 3, fill: showLow ? '#3182CE' : mutedSeries }}
              hide={!showLow}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="medium"
              name="Moyenne"
              stroke={showMedium ? '#2F855A' : mutedSeries}
              strokeWidth={2}
              dot={{ r: 3, fill: showMedium ? '#2F855A' : mutedSeries }}
              hide={!showMedium}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="high"
              name="Haute"
              stroke={showHigh ? '#E53E3E' : mutedSeries}
              strokeWidth={2}
              dot={{ r: 3, fill: showHigh ? '#E53E3E' : mutedSeries }}
              hide={!showHigh}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default SoilTemperatureChart;
