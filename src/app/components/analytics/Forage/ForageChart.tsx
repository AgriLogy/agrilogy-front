import React, { useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Box, Flex, Button, HStack } from '@chakra-ui/react';
import { FaDownload, FaCamera } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import ChartPanelHeading from '../../common/ChartPanelHeading';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { useUnitOverridesRevision } from '@/app/hooks/useUnitOverridesRevision';
import { useChartAxisColors } from '@/app/utils/useChartAxisColors';
import ChartLegend from '../../common/ChartLegend';
import {
  activeDotForSeries,
  addTimeMsToChartRows,
  defaultLegendWrapperStyle,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
  mergeAxisTheme,
  themedCartesianGrid,
  getChartMarginLeft,
  CHART_PLOT_HEIGHT_PX,
  analyticsChartPanelLayoutProps,
  yAxisLabelInsideLeft,
} from '@/app/utils/chartAxisConfig';

export interface ForageChartRow {
  timestamp: string;
  /** Depth to the water surface D(t) in metres. */
  depthM: number;
}

const STROKE_DEPTH = '#2563eb';

const ForageChart = ({
  data,
  loading,
  highM,
  lowM,
}: {
  data: ForageChartRow[];
  loading: boolean;
  highM: number | null;
  lowM: number | null;
}) => {
  const t = useTranslations();
  const chartRef = useRef<HTMLDivElement>(null);
  const unitRev = useUnitOverridesRevision();

  const chartData = useMemo(
    () =>
      addTimeMsToChartRows(
        data.map((item) => ({
          name: item.timestamp,
          depthM: item.depthM,
        })),
        'name'
      ),
    [data, unitRev]
  );

  const { textColor } = useColorModeStyles();
  const { axis, tickFill, grid } = useChartAxisColors();
  const xAxisProps = mergeAxisTheme(
    getAdaptiveTimeXAxisProps(chartData, 'name'),
    axis,
    tickFill
  );
  const yProps = mergeAxisTheme(getDefaultYAxisProps(1), axis, tickFill);

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'forage_depth_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      'timestamp,depth_m\n' +
      data.map((d) => `${d.timestamp},${d.depthM}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'forage_depth_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box {...analyticsChartPanelLayoutProps}>
      <Flex
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        gap={2}
        mb={4}
      >
        <ChartPanelHeading
          color={textColor}
          title={t('analytics.forage.chartTitle')}
          subtitle={t('analytics.forage.chartSubtitle')}
        />
        <HStack spacing={2}>
          <Button
            aria-label={t('analytics.actions.captureChart')}
            variant="ghost"
            onClick={handleScreenshot}
          >
            <FaCamera />
          </Button>
          <Button
            aria-label={t('analytics.actions.exportCsv')}
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
        height={CHART_PLOT_HEIGHT_PX}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 12,
              right: 12,
              left: getChartMarginLeft(),
              bottom: 8,
            }}
          >
            <CartesianGrid {...themedCartesianGrid(grid)} />
            <XAxis {...xAxisProps} />
            <YAxis
              yAxisId="depth"
              {...yProps}
              label={yAxisLabelInsideLeft('m', tickFill)}
            />
            <Tooltip content={<UnifiedTooltip valuesAlreadyCalibrated />} />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={<ChartLegend />}
            />
            <Line
              yAxisId="depth"
              type="monotone"
              dataKey="depthM"
              name={`${t('analytics.forage.depthSeries')} (m)`}
              stroke={STROKE_DEPTH}
              strokeWidth={2.25}
              dot={false}
              activeDot={activeDotForSeries(STROKE_DEPTH)}
              isAnimationActive={false}
            />
            {highM != null && (
              <ReferenceLine
                yAxisId="depth"
                y={highM}
                stroke="#38a169"
                strokeDasharray="4 4"
                label={{
                  value: t('analytics.forage.highShort'),
                  fontSize: 11,
                  fill: '#38a169',
                }}
              />
            )}
            {lowM != null && (
              <ReferenceLine
                yAxisId="depth"
                y={lowM}
                stroke="#e53e3e"
                strokeDasharray="4 4"
                label={{
                  value: t('analytics.forage.lowShort'),
                  fontSize: 11,
                  fill: '#e53e3e',
                }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default ForageChart;
