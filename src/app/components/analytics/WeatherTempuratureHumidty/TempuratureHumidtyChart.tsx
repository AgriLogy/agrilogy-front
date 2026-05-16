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
} from 'recharts';
import { Box, Flex, Button, HStack } from '@chakra-ui/react';
import { FaDownload, FaCamera } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import ChartPanelHeading from '../../common/ChartPanelHeading';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import { calibrateChartValue } from '@/app/utils/chartSeriesCalibration';
import { resolveAxisUnit } from '@/app/utils/unitOverrides';
import { useChartAxisColors } from '@/app/utils/useChartAxisColors';
import ChartLegend, {
  type ChartLegendPayloadEntry,
} from '../../common/ChartLegend';
import {
  activeDotForSeries,
  addTimeMsToChartRows,
  defaultLegendWrapperStyle,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
  mergeAxisTheme,
  themedCartesianGrid,
  CHART_MARGIN_LEFT_Y_LABEL,
  CHART_MARGIN_RIGHT_Y_LABEL,
  CHART_PLOT_HEIGHT_PX,
  analyticsChartPanelLayoutProps,
  yAxisLabelInsideLeft,
  yAxisLabelInsideRight,
} from '@/app/utils/chartAxisConfig';

interface WeatherData {
  id: number;
  timestamp: string;
  default_unit: string;
  available_units: string[];
  value: number;
  zone: number;
  user: number;
}

const TempuratureHumidtyChart = ({
  humidityData,
  temperatureData,
  loading,
}: {
  humidityData: WeatherData[];
  temperatureData: WeatherData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { textColor } = useColorModeStyles();
  const { axis, tickFill, grid } = useChartAxisColors();
  const unitRev = useUnitOverridesRevision();

  const mergedData = useMemo(
    () =>
      humidityData.map((h) => {
        const tempEntry = temperatureData.find(
          (t) => t.timestamp === h.timestamp
        );
        return {
          timestamp: h.timestamp,
          humidity: calibrateChartValue('humidity_weather', h.value),
          temperature:
            tempEntry != null && tempEntry.value != null
              ? calibrateChartValue('temperature_weather', tempEntry.value)
              : null,
        };
      }),
    [humidityData, temperatureData, unitRev]
  );

  const chartData = useMemo(
    () => addTimeMsToChartRows(mergedData, 'timestamp'),
    [mergedData]
  );
  const xAxisProps = mergeAxisTheme(
    getAdaptiveTimeXAxisProps(chartData, 'timestamp'),
    axis,
    tickFill
  );
  const yTemp = mergeAxisTheme(getDefaultYAxisProps(1), axis, tickFill);
  const yHum = mergeAxisTheme(getDefaultYAxisProps(0), axis, tickFill);

  const tempUnit = resolveAxisUnit(
    'temperature_weather',
    temperatureData[0]?.default_unit
  );
  const humUnit = resolveAxisUnit(
    'humidity_weather',
    humidityData[0]?.default_unit
  );

  const [seriesVisible, setSeriesVisible] = useState({
    temperature: true,
    humidity: true,
  });

  const handleLegendClick = (e: ChartLegendPayloadEntry) => {
    const k = e.dataKey;
    if (k !== 'temperature' && k !== 'humidity') return;
    setSeriesVisible((p) => ({ ...p, [k]: !p[k as keyof typeof p] }));
  };

  const hiddenLegendKeys = Object.entries(seriesVisible)
    .filter(([, on]) => !on)
    .map(([key]) => key) as string[];

  // Screenshot capture function
  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'weather_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // CSV data export function
  const handleDownloadData = () => {
    const csv =
      'timestamp,humidity,temperature\n' +
      mergedData
        .map((d) => `${d.timestamp},${d.humidity},${d.temperature ?? ''}`)
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'weather_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box {...analyticsChartPanelLayoutProps}>
      <Flex justify="space-between" align="center" mb={4}>
        <ChartPanelHeading
          color={textColor}
          title="Air — température et humidité relative"
          subtitle={`Échelles lecture ${tempUnit} et ${humUnit} ; axe temps adaptatif selon la fenêtre.`}
        />
        <HStack spacing={2}>
          <Button
            aria-label="Capture graphique"
            variant="ghost"
            onClick={handleScreenshot}
          >
            <FaCamera />
          </Button>
          <Button
            aria-label="Exporter CSV"
            variant="ghost"
            onClick={handleDownloadData}
          >
            <FaDownload />
          </Button>
        </HStack>
      </Flex>
      <ChartStateView
        loading={loading}
        empty={mergedData.length === 0}
        emptyText="Pas de données disponibles"
        chartRef={chartRef}
        height={CHART_PLOT_HEIGHT_PX}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 12,
              right: CHART_MARGIN_RIGHT_Y_LABEL,
              left: CHART_MARGIN_LEFT_Y_LABEL,
              bottom: 8,
            }}
          >
            <CartesianGrid {...themedCartesianGrid(grid)} />
            <XAxis {...xAxisProps} />
            <YAxis
              yAxisId="left"
              {...yTemp}
              label={yAxisLabelInsideLeft(`Temp. (${tempUnit})`, tickFill)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              {...yHum}
              label={yAxisLabelInsideRight(`HR (${humUnit})`, tickFill)}
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
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              name={`Température (${tempUnit})`}
              stroke="#D69E2E"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={false}
              activeDot={activeDotForSeries('#D69E2E')}
              hide={!seriesVisible.temperature}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="humidity"
              name={`Humidité (${humUnit})`}
              stroke="#2C7A7B"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={false}
              activeDot={activeDotForSeries('#2C7A7B')}
              hide={!seriesVisible.humidity}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default TempuratureHumidtyChart;
