import React, { useRef, useState } from 'react';
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
import { Box, Flex, Text, Button, HStack } from '@chakra-ui/react';
import { FaDownload, FaCamera } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { SensorData } from '@/app/types';
import { roundNumber } from '@/app/utils/formatNumber';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import ChartLegend from '../../common/ChartLegend';
import {
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultLegendWrapperStyle,
  defaultLineProps,
  getAdaptiveTimeXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';

/** Wind speed sensor data may include optional wind_gust (rafale). */
type WindSpeedSensorData = SensorData & { wind_gust?: number };

const WindSpeedChart = ({
  data,
  loading,
}: {
  data: WindSpeedSensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [showLine, setShowLine] = useState(true);
  const [showGust, setShowGust] = useState(true);

  const chartData = addTimeMsToChartRows(
    data.map((item) => ({
      name: item.timestamp,
      value: roundNumber(item.value),
      wind_gust: item.wind_gust != null ? roundNumber(item.wind_gust) : undefined,
    })),
    'name'
  );

  const { textColor } = useColorModeStyles();
  const xAxisProps = getAdaptiveTimeXAxisProps(chartData, 'name');
  const yAxisProps = getDefaultYAxisProps(2);

  const SPEED_LABEL = 'Vitesse du vent (km/h)';
  const GUST_LABEL = 'Ravale du vent (km/h)';

  const handleLegendClick = (data: any) => {
    if (data.value === SPEED_LABEL) {
      setShowLine((prev) => !prev);
    }
    if (data.value === GUST_LABEL) {
      setShowGust((prev) => !prev);
    }
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'wind_speed_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const hasGust = data.some(
      (d) => (d as WindSpeedSensorData).wind_gust != null
    );
    const header = hasGust
      ? 'timestamp,value,wind_gust\n'
      : 'timestamp,value\n';
    const rows = data.map((d) => {
      const row = `${d.timestamp},${d.value}`;
      const gust = (d as WindSpeedSensorData).wind_gust;
      return hasGust ? `${row},${gust ?? ''}` : row;
    });
    const csv = header + rows.join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'wind_speed_data.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Évolution de la vitesse du vent
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
            margin={{ top: 16, right: 0, left: 40, bottom: 5 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis
              {...yAxisProps}
              label={{
                value: 'km/h',
                angle: -90,
                dx: -35,
                dy: 20,
                position: 'insideLeft',
                style: { fontSize: 14, fill: '#64748b' },
              }}
            />
            <Tooltip content={<UnifiedTooltip />} />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={<ChartLegend onClick={handleLegendClick} />}
            />
            <Line
              type="monotone"
              dataKey="value"
              name={SPEED_LABEL}
              stroke={showLine ? '#82ca9d' : 'gray'}
              {...defaultLineProps}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="wind_gust"
              name={GUST_LABEL}
              stroke={showGust ? '#ed8936' : 'gray'}
              strokeDasharray="5 5"
              {...defaultLineProps}
              isAnimationActive={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default WindSpeedChart;
