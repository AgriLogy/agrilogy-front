import React, { useMemo, useRef, useState } from 'react';
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
import ChartPanelHeading from '../../common/ChartPanelHeading';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import { calibrateChartValue } from '@/app/utils/chartSeriesCalibration';
import { resolveAxisUnit } from '@/app/utils/unitOverrides';
import { useChartAxisColors } from '@/app/utils/useChartAxisColors';
import ChartLegend, {
  type ChartLegendPayloadEntry,
} from '../../common/ChartLegend';
import {
  addTimeMsToChartRows,
  defaultBarProps,
  defaultLegendWrapperStyle,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
  maxBarSizeForPointCount,
  mergeAxisTheme,
  themedCartesianGrid,
  CHART_MARGIN_LEFT_Y_LABEL,
  CHART_PLOT_HEIGHT_PX,
  analyticsChartPanelLayoutProps,
  yAxisLabelInsideLeft,
} from '@/app/utils/chartAxisConfig';

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
  const unitRev = useUnitOverridesRevision();

  const chartData = useMemo(
    () =>
      addTimeMsToChartRows(
        weatherData.map((item, index) => {
          const calculated = calculatedData[index]?.value ?? null;
          return {
            name: item.timestamp,
            et0_sensor: calibrateChartValue('et0', item.value),
            et0_calculated:
              calculated != null && Number.isFinite(calculated)
                ? calibrateChartValue('et0', calculated)
                : null,
          };
        }),
        'name'
      ),
    [weatherData, calculatedData, unitRev]
  );

  const textColor = useColorModeValue('gray.800', 'gray.200');
  const { axis, tickFill, grid } = useChartAxisColors();
  const xAxisProps = mergeAxisTheme(
    getAdaptiveTimeXAxisProps(chartData, 'name'),
    axis,
    tickFill
  );
  const yProps = mergeAxisTheme(getDefaultYAxisProps(2), axis, tickFill);

  const [seriesVisible, setSeriesVisible] = useState({
    et0_sensor: true,
    et0_calculated: true,
  });

  const handleLegendClick = (e: ChartLegendPayloadEntry) => {
    const k = e.dataKey;
    if (k !== 'et0_sensor' && k !== 'et0_calculated') return;
    setSeriesVisible((p) => ({ ...p, [k]: !p[k as keyof typeof p] }));
  };

  const hiddenLegendKeys = Object.entries(seriesVisible)
    .filter(([, on]) => !on)
    .map(([key]) => key) as string[];

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
      'timestamp,et0_sensor,et0_calculated\n' +
      chartData
        .map((d) => `${d.name},${d.et0_sensor ?? ''},${d.et0_calculated ?? ''}`)
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'et0_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const et0Unit = resolveAxisUnit(
    'et0',
    weatherData[0]?.default_unit ?? calculatedData[0]?.default_unit
  );

  return (
    <Box {...analyticsChartPanelLayoutProps}>
      <Flex justify="space-between" align="center" mb={4}>
        <ChartPanelHeading
          color={textColor}
          title="ET₀ — évapotranspiration de référence"
          subtitle={`Comparaison mesures capteur et série calculée — unité affichée ${et0Unit}.`}
        />
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
        emptyText="Aucune donnée disponible"
        chartRef={chartRef}
        height={CHART_PLOT_HEIGHT_PX}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: CHART_MARGIN_LEFT_Y_LABEL,
              bottom: 5,
            }}
            barCategoryGap="14%"
          >
            <CartesianGrid {...themedCartesianGrid(grid)} />
            <XAxis {...xAxisProps} />
            <YAxis
              {...yProps}
              label={yAxisLabelInsideLeft(`ET₀ (${et0Unit})`, tickFill)}
            />
            <Tooltip content={<UnifiedTooltip valuesAlreadyCalibrated />} />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={
                <ChartLegend
                  onClick={handleLegendClick}
                  hiddenDataKeys={hiddenLegendKeys}
                />
              }
            />
            <Bar
              dataKey="et0_sensor"
              {...defaultBarProps}
              maxBarSize={maxBarSizeForPointCount(chartData.length)}
              fill="#3182ce"
              name={`ET0 Capteur (${et0Unit})`}
              hide={!seriesVisible.et0_sensor}
            />
            <Bar
              dataKey="et0_calculated"
              {...defaultBarProps}
              maxBarSize={maxBarSizeForPointCount(chartData.length)}
              fill="#e53e3e"
              name={`ET0 Calculé (${et0Unit})`}
              hide={!seriesVisible.et0_calculated}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default EC0Chart;
