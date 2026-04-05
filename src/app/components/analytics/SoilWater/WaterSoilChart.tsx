import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useRef, useMemo } from 'react';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import { calibrateChartValue } from '@/app/utils/chartSeriesCalibration';
import { calibratedValueInAxisUnit } from '@/app/utils/calibratedValueInAxisUnit';
import {
  formatCalibratedReading,
  resolveAxisUnit,
} from '@/app/utils/unitOverrides';
import { getCatalogDefaultUnit } from '@/app/utils/sensorCatalog';
import html2canvas from 'html2canvas';
import { FaCamera, FaDownload } from 'react-icons/fa';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { ThresholdBand, WaterSoilData } from '@/app/types';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import { useChartAxisColors } from '@/app/utils/useChartAxisColors';

const MOISTURE_AXIS_UNIT = '%';

const WaterSoilChart = ({
  data,
  waterFlowDefaultUnit,
  thresholds,
  targetAxis = 'left', // which Y axis the bands align to
  loading = false,
}: {
  data: WaterSoilData[];
  /** API default_unit for the water_flow series (merged rows omit it). */
  waterFlowDefaultUnit?: string;
  thresholds: ThresholdBand;
  targetAxis?: 'left' | 'right';
  loading?: boolean;
}) => {
  const { critical_min, critical_max, normal_min, normal_max } = thresholds;
  const unitRev = useUnitOverridesRevision();

  const displayData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        rawSoilLow: d.soilLow,
        rawSoilMedium: d.soilMedium,
        rawSoilHigh: d.soilHigh,
        rawWaterFlow: d.waterFlow,
        soilLow:
          d.soilLow != null && Number.isFinite(d.soilLow)
            ? calibratedValueInAxisUnit(
                'soil_moisture_low',
                d.soilLow,
                MOISTURE_AXIS_UNIT,
                MOISTURE_AXIS_UNIT
              )
            : d.soilLow,
        soilMedium:
          d.soilMedium != null && Number.isFinite(d.soilMedium)
            ? calibratedValueInAxisUnit(
                'soil_moisture_medium',
                d.soilMedium,
                MOISTURE_AXIS_UNIT,
                MOISTURE_AXIS_UNIT
              )
            : d.soilMedium,
        soilHigh:
          d.soilHigh != null && Number.isFinite(d.soilHigh)
            ? calibratedValueInAxisUnit(
                'soil_moisture_high',
                d.soilHigh,
                MOISTURE_AXIS_UNIT,
                MOISTURE_AXIS_UNIT
              )
            : d.soilHigh,
        waterFlow:
          d.waterFlow != null && Number.isFinite(d.waterFlow)
            ? calibrateChartValue('water_flow', d.waterFlow)
            : d.waterFlow,
      })),
    [data, unitRev]
  );

  const bandKey = 'soil_moisture_medium' as const;
  const calibratedBands = useMemo(
    () => ({
      critical_min: calibratedValueInAxisUnit(
        bandKey,
        critical_min,
        MOISTURE_AXIS_UNIT,
        MOISTURE_AXIS_UNIT
      ),
      critical_max: calibratedValueInAxisUnit(
        bandKey,
        critical_max,
        MOISTURE_AXIS_UNIT,
        MOISTURE_AXIS_UNIT
      ),
      normal_min: calibratedValueInAxisUnit(
        bandKey,
        normal_min,
        MOISTURE_AXIS_UNIT,
        MOISTURE_AXIS_UNIT
      ),
      normal_max: calibratedValueInAxisUnit(
        bandKey,
        normal_max,
        MOISTURE_AXIS_UNIT,
        MOISTURE_AXIS_UNIT
      ),
    }),
    [critical_min, critical_max, normal_min, normal_max, unitRev]
  );

  const flowUnit = resolveAxisUnit('water_flow', waterFlowDefaultUnit);
  const humLowUnit = resolveAxisUnit('soil_moisture_low');
  const humMedUnit = resolveAxisUnit('soil_moisture_medium');
  const humHighUnit = resolveAxisUnit('soil_moisture_high');

  const labelInterval = useBreakpointValue({
    base: Math.ceil(Math.max(displayData.length, 1) / 3),
    md: Math.ceil(Math.max(displayData.length, 1) / 5),
  });

  const _labelAngle = useBreakpointValue({ base: -3, md: 5 });
  const chartRef = useRef<HTMLDivElement>(null);

  const handleScreenshot = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = 'water_soil_data.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleDownloadData = () => {
    const headers = [
      'timestamp',
      'soilLow',
      'soilMedium',
      'soilHigh',
      'waterFlow',
    ];
    const csv =
      headers.join(',') +
      '\n' +
      displayData
        .map((d) =>
          [
            d.timestamp,
            d.soilLow ?? '',
            d.soilMedium ?? '',
            d.soilHigh ?? '',
            d.waterFlow ?? '',
          ].join(',')
        )
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'water_soil_data.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  const { textColor } = useColorModeStyles();
  const { axis, grid } = useChartAxisColors();

  // X range for the background areas (span the whole chart)
  const [xStart, xEnd] = useMemo(() => {
    if (!displayData?.length) return [undefined, undefined] as const;
    return [
      displayData[0].timestamp,
      displayData[displayData.length - 1].timestamp,
    ] as const;
  }, [displayData]);

  return (
    <Box width="100%" height="100%">
      <Flex justify="space-between" align="center" mb={1}>
        <Text fontSize="xl" fontWeight="bold" mb={2} color={textColor}>
          Eau disponible
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

      {/* Inline legend for bands (since Legend payload would override series legend) */}
      <HStack spacing={4} mb={3}>
        <HStack spacing={2}>
          <Box
            w="12px"
            h="12px"
            bg="#ef4444"
            opacity={0.5}
            borderRadius="2px"
          />
          <Text fontSize="sm" color={textColor}>
            Zone critique
          </Text>
        </HStack>
        <HStack spacing={2}>
          <Box
            w="12px"
            h="12px"
            bg="#3b82f6"
            opacity={0.5}
            borderRadius="2px"
          />
          <Text fontSize="sm" color={textColor}>
            Zone normale
          </Text>
        </HStack>
      </HStack>

      <ChartStateView
        loading={loading}
        empty={!displayData?.length}
        emptyText="Aucune donnée à afficher."
        chartRef={chartRef}
        height={300}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />

            {/* Background bands — render BEFORE series so they appear behind */}
            {xStart !== undefined && xEnd !== undefined && (
              <>
                {/* Critical band (red) */}
                <ReferenceArea
                  x1={xStart}
                  x2={xEnd}
                  yAxisId={targetAxis}
                  y1={calibratedBands.critical_min}
                  y2={calibratedBands.critical_max}
                  fill="#ef4444"
                  fillOpacity={0.12}
                  strokeOpacity={0}
                  ifOverflow="hidden"
                />
                {/* Normal band (blue) */}
                <ReferenceArea
                  x1={xStart}
                  x2={xEnd}
                  yAxisId={targetAxis}
                  y1={calibratedBands.normal_min}
                  y2={calibratedBands.normal_max}
                  fill="#3b82f6"
                  fillOpacity={0.12}
                  strokeOpacity={0}
                  ifOverflow="hidden"
                />
              </>
            )}

            <XAxis
              dataKey="timestamp"
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
              domain={[0, 100]}
              label={{
                value: `${MOISTURE_AXIS_UNIT} (axe commun)`,
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

            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 'auto']}
              label={{
                value: flowUnit,
                angle: 90,
                position: 'inside',
                dx: 20,
                fontSize: 18,
                fontFamily: 'Arial, sans-serif',
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

            <Tooltip
              content={
                <UnifiedTooltip
                  valueFormatter={(_value, _name, item) => {
                    const p = item.payload as Record<string, unknown>;
                    const dk = String(item.dataKey ?? '');
                    if (
                      dk === 'soilLow' &&
                      typeof p.rawSoilLow === 'number' &&
                      Number.isFinite(p.rawSoilLow)
                    ) {
                      return `${formatCalibratedReading('soil_moisture_low', p.rawSoilLow)} ${humLowUnit}`.trim();
                    }
                    if (
                      dk === 'soilMedium' &&
                      typeof p.rawSoilMedium === 'number' &&
                      Number.isFinite(p.rawSoilMedium)
                    ) {
                      return `${formatCalibratedReading('soil_moisture_medium', p.rawSoilMedium)} ${humMedUnit}`.trim();
                    }
                    if (
                      dk === 'soilHigh' &&
                      typeof p.rawSoilHigh === 'number' &&
                      Number.isFinite(p.rawSoilHigh)
                    ) {
                      return `${formatCalibratedReading('soil_moisture_high', p.rawSoilHigh)} ${humHighUnit}`.trim();
                    }
                    if (
                      dk === 'waterFlow' &&
                      typeof p.rawWaterFlow === 'number' &&
                      Number.isFinite(p.rawWaterFlow)
                    ) {
                      return `${formatCalibratedReading('water_flow', p.rawWaterFlow)} ${flowUnit}`.trim();
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
            <Legend />

            {/* Soil moisture lines */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="waterFlow"
              name={`Débit (${flowUnit})`}
              fill="#b3e5fc"
              stroke="#0288d1"
              strokeWidth={2}
              fillOpacity={0.5}
              connectNulls={true} //
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="soilLow"
              name={`Humidité basse (${humLowUnit})`}
              stroke="#8884d8"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="soilMedium"
              name={`Humidité moyenne (${humMedUnit})`}
              stroke="#82ca9d"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="soilHigh"
              name={`Humidité haute (${humHighUnit})`}
              stroke="#ffc658"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />

            {/* Water flow area */}
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default WaterSoilChart;
