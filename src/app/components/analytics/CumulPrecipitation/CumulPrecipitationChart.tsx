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
  defaultCartesianGridProps,
  getPeriodXAxisProps,
  getDefaultYAxisProps,
} from '@/app/utils/chartAxisConfig';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';

const aggregateData = (data: SensorData[], period: string) => {
  const result: Record<string, number> = {};
  data.forEach((d) => {
    const date = new Date(d.timestamp);
    let key = '';
    if (period === 'day') {
      key = date.toISOString().split('T')[0];
    } else if (period === 'week') {
      const year = date.getFullYear();
      const week = Math.ceil(
        ((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 +
          new Date(year, 0, 1).getDay() +
          1) /
          7
      );
      key = `${year}-W${week}`;
    } else if (period === 'month') {
      key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
    }
    result[key] = (result[key] || 0) + d.value;
  });
  return Object.entries(result).map(([period, value]) => ({ period, value }));
};

const CumulPrecipitationChart = ({
  data,
  loading,
}: {
  data: SensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [groupBy, setGroupBy] = useState('day');
  const { colorMode } = useColorMode();
  const chartData = aggregateData(data, groupBy);
  const { textColor } = useColorModeStyles();
  const periodXAxisProps = getPeriodXAxisProps();
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
      'period,total_precipitation_mm\n' +
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

  return (
    <Box width="100%" pr={4} pb={4} borderRadius="md" p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Irrigation cumulée
        </Text>
        <HStack spacing={2}>
          <Select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            bg={colorMode === 'dark' ? 'gray.700' : 'white'}
            color={textColor}
          >
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
            margin={{ top: 16, right: 24, left: 8, bottom: 40 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} stroke={gridStroke} />
            <XAxis
              dataKey="period"
              {...periodXAxisProps}
              angle={0}
              textAnchor="middle"
              // interval={labelInterval}
            />
            <YAxis
              {...yAxisProps}
              label={{
                value: 'mm',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 11, fill: '#64748b' },
              }}
            />
            <Tooltip content={<UnifiedTooltip />} />
            <Legend
              wrapperStyle={{ color: legendTextColor }}
              // Alternatively, you can customize the payload style for more control
            />
            <Bar
              dataKey="value"
              name="Irrigation cumulée"
              fill={colorMode === 'dark' ? '#60a5fa' : '#3b82f6'} // lighter blue in dark mode
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default CumulPrecipitationChart;
