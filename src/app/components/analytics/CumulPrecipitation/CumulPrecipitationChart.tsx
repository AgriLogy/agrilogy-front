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
  useBreakpointValue,
  Select,
  useColorMode,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { FaDownload, FaCloudRain } from 'react-icons/fa';
import { SensorData } from '@/app/types';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import EmptyBox from '../../common/EmptyBox';

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
  const labelInterval = useBreakpointValue({
    base: Math.ceil(chartData.length / 3),
    md: Math.ceil(chartData.length / 5),
  });
  const labelAngle = useBreakpointValue({ base: -3, md: 5 });
  const { textColor } = useColorModeStyles();

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
      chartData.map((d) => `${d.period},${d.value.toFixed(2)}`).join('\n');
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
  const tooltipStyle = {
    backgroundColor: colorMode === 'dark' ? '#333' : '#fff',
    borderColor: colorMode === 'dark' ? '#555' : '#ccc',
    color: colorMode === 'dark' ? '#eee' : '#000',
  };
  const legendTextColor = textColor;

  return (
    <Box width="100%" pr={4} pb={4} borderRadius="md" p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Cumul de précipitations
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

      <Box ref={chartRef} height="300px" borderRadius="md" p={2}>
        {loading ? (
          <EmptyBox text="Chargement..." />
        ) : chartData.length === 0 ? (
          <EmptyBox text="Pas de données" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
              <XAxis
                dataKey="period"
                angle={0}
                textAnchor="middle"
                interval={labelInterval}
                // stroke={axisTickColor}
                // tick={{ fill: axisTickColor }}
                // tickLine={{ stroke: axisTickColor }}
                // axisLine={{ stroke: axisTickColor }}

                stroke="#666"                    // Axis line color
                strokeWidth={1}                  // Axis line thickness
                tick={{                          // Tick styling
                  fill: '#666',                  // Tick label color
                  fontSize: 17,                  // Tick label font size
                  fontFamily: 'Arial, sans-serif' // Tick label font
                }}
                axisLine={{                       // Main axis line styling
                  stroke: '#666',
                  strokeWidth: 1
                }}
                tickLine={{                       // Tick line styling
                  stroke: '#666',
                  strokeWidth: 1
                              }}
              />
              <YAxis
              // label={{
              //   angle: -90,
              //   value: "mm",
              //   position: "insideLeft",
              //   fill: axisTickColor,
              // }}
              // stroke={axisTickColor}
              // tick={{ fill: axisTickColor }}
              // tickLine={{ stroke: axisTickColor }}
              // axisLine={{ stroke: axisTickColor }}
              stroke="#666"                    // Axis line color
              strokeWidth={1}                  // Axis line thickness
              tick={{                          // Tick styling
                fill: '#666',                  // Tick label color
                fontSize: 17,                  // Tick label font size
                fontFamily: 'Arial, sans-serif' // Tick label font
              }}
              axisLine={{                       // Main axis line styling
                stroke: '#666',
                strokeWidth: 1
              }}
              tickLine={{                       // Tick line styling
                stroke: '#666',
                strokeWidth: 1
                            }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={{ color: axisTickColor }}
              />
              <Legend
                wrapperStyle={{ color: legendTextColor }}
                // Alternatively, you can customize the payload style for more control
              />
              <Bar
                dataKey="value"
                name="Précipitations cumulées"
                fill={colorMode === 'dark' ? '#60a5fa' : '#3b82f6'} // lighter blue in dark mode
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default CumulPrecipitationChart;
