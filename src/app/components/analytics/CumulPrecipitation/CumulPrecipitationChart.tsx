import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Box,
  Text,
  Flex,
  HStack,
  Button,
  Select,
  useColorMode,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { FaDownload, FaCloudRain } from 'react-icons/fa';
import { SensorData } from '@/app/types';
import { formatNumber } from '@/app/utils/formatNumber';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import {
  addTimeMsToChartRows,
  defaultBarProps,
  defaultCartesianGridProps,
  defaultLegendWrapperStyle,
  getAdaptiveTimeXAxisProps,
  getPeriodXAxisProps,
  getDefaultYAxisProps,
  defaultTooltipCursor,
} from '@/app/utils/chartAxisConfig';
import ChartStateView from '../../common/ChartStateView';
import ChartLegend from '../../common/ChartLegend';
import UnifiedTooltip from '../../common/UnifiedTooltip';

type GroupBy = 'raw' | 'hour' | 'day' | 'week' | 'month';

const aggregateData = (data: SensorData[], groupBy: GroupBy) => {
  const result: Record<string, number> = {};

  data.forEach((d) => {
    const date = new Date(d.timestamp);
    if (Number.isNaN(date.getTime())) return;

    let key = '';
    if (groupBy === 'raw') {
      // No resampling: keep incoming timestamps (but still combine duplicates).
      key = d.timestamp;
    } else if (groupBy === 'hour') {
      // Bucket by hour while preserving an ISO timestamp for time-based formatting.
      const hour = new Date(date);
      hour.setMinutes(0, 0, 0);
      key = hour.toISOString();
    } else if (groupBy === 'day') {
      // Bucket by calendar day.
      key = date.toISOString().split('T')[0];
    } else if (groupBy === 'week') {
      const year = date.getFullYear();
      const week = Math.ceil(
        ((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 +
          new Date(year, 0, 1).getDay() +
          1) /
          7
      );
      key = `${year}-W${week}`;
    } else if (groupBy === 'month') {
      key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
    }

    if (!key) return;
    result[key] = (result[key] || 0) + d.value;
  });

  const rows = Object.entries(result).map(([period, value]) => ({
    period,
    value,
  }));

  // For time-like keys, ensure chronological order.
  if (groupBy === 'raw' || groupBy === 'hour' || groupBy === 'day') {
    rows.sort(
      (a, b) => new Date(a.period).getTime() - new Date(b.period).getTime()
    );
  }

  return rows;
};

const CumulPrecipitationChart = ({
  data,
  loading,
}: {
  data: SensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>('day');
  const [showValue, setShowValue] = useState(true);
  const { colorMode } = useColorMode();
  const chartData = addTimeMsToChartRows(
    aggregateData(data, groupBy),
    'period'
  );
  const { textColor } = useColorModeStyles();
  const periodXAxisProps = getPeriodXAxisProps();
  const timeXAxisProps = getAdaptiveTimeXAxisProps(chartData, 'period');
  const yAxisProps = getDefaultYAxisProps(2);

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'precipitation_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      `${groupBy},total_precipitation_mm\n` +
      chartData.map((d) => `${d.period},${formatNumber(d.value)}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'precipitation_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Colors for Recharts elements based on color mode
  const axisTickColor = colorMode === 'dark' ? '#ccc' : '#333';
  const gridStroke = colorMode === 'dark' ? '#444' : '#ddd';
  const legendTextColor = textColor;

  const handleLegendClick = () => {
    setShowValue((prev) => !prev);
  };

  return (
    <Box width="100%" pr={4} pb={4} borderRadius="md" p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Irrigation cumulé
        </Text>
        <HStack spacing={2}>
          <Select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupBy)}
            bg={colorMode === 'dark' ? 'gray.700' : 'white'}
            color={textColor}
          >
            <option value="raw">Brut (sans agrégation)</option>
            <option value="hour">Par heure</option>
            <option value="day">Par jour</option>
            <option value="week">Par semaine</option>
            <option value="month">Par mois</option>
          </Select>
          <Button onClick={handleScreenshot} aria-label="Capture chart">
            <FaCloudRain />
          </Button>
          <Button onClick={handleDownloadData} aria-label="Download data CSV">
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
          <BarChart
            data={chartData}
            margin={{ top: 16, right: 0, left: 35, bottom: 5 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} stroke={gridStroke} />
            <XAxis
              dataKey="period"
              {...(groupBy === 'week' || groupBy === 'month'
                ? periodXAxisProps
                : groupBy === 'day'
                  ? periodXAxisProps
                  : timeXAxisProps)}
              angle={0}
              textAnchor="middle"
              // interval={labelInterval}
            />
            <YAxis
              {...yAxisProps}
              label={{
                value: 'mm',
                angle: -90,
                dx: -50,
                dy: 110,
                position: 'top',
                style: { fontSize: 14, fill: '#64748b' },
              }}
            />
            <Tooltip
              content={<UnifiedTooltip />}
              cursor={defaultTooltipCursor}
            />
            <Legend
              wrapperStyle={{
                ...defaultLegendWrapperStyle,
                color: legendTextColor,
              }}
              content={<ChartLegend onClick={handleLegendClick} />}
            />
            <Bar
              dataKey="value"
              name="Irrigation cumulé"
              fill={colorMode === 'dark' ? '#60a5fa' : '#3b82f6'} // lighter blue in dark mode
              fillOpacity={0.9}
              {...defaultBarProps}
              hide={!showValue}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default CumulPrecipitationChart;
