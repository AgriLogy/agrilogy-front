import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Bar,
  ComposedChart,
} from 'recharts';
import { Box, Flex, Text, Button, HStack } from '@chakra-ui/react';
import { FaCamera, FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { SensorData } from '@/app/types';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { useMemo, useRef, useState } from 'react';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import ChartLegend from '../../common/ChartLegend';
import {
  addTimeMsToChartRows,
  defaultCartesianGridProps,
  defaultBarProps,
  defaultLegendWrapperStyle,
  defaultLineProps,
  defaultTooltipCursor,
  getAdaptiveTimeXAxisProps,
} from '@/app/utils/chartAxisConfig';

const SoilConductivityChart = ({
  lowData,
  highData,
  flowData,
  loading,
}: {
  lowData: SensorData[];
  highData: SensorData[];
  flowData: SensorData[];
  loading: boolean;
}) => {
  const [activeLines, setActiveLines] = useState({
    low: true,
    high: true,
    waterflow: true,
  });
  const chartRef = useRef<HTMLDivElement>(null);
  const { textColor } = useColorModeStyles();

  const chartData = useMemo(() => {
    const lowMap = new Map(lowData.map((d) => [d.timestamp, d.value]));
    const highMap = new Map(highData.map((d) => [d.timestamp, d.value]));
    const flowMap = new Map(flowData.map((f) => [f.timestamp, f.value]));
    const allTs = Array.from(
      new Set([
        ...lowData.map((d) => d.timestamp),
        ...highData.map((d) => d.timestamp),
        ...flowData.map((d) => d.timestamp),
      ])
    ).sort((a, b) => a.localeCompare(b));

    const rows = allTs.map((timestamp) => ({
      timestamp,
      low: lowMap.get(timestamp) ?? null,
      high: highMap.get(timestamp) ?? null,
      waterflow: flowMap.get(timestamp) ?? null,
    }));
    return addTimeMsToChartRows(rows, 'timestamp');
  }, [lowData, highData, flowData]);

  const handleLegendClick = (e: any) => {
    const key = e.dataKey as keyof typeof activeLines;
    setActiveLines((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const xAxisProps = getAdaptiveTimeXAxisProps(chartData, 'timestamp');

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'soil_conductivity_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      'timestamp,low,high,waterflow\n' +
      chartData
        .map((d) => `${d.timestamp},${d.low},${d.high},${d.waterflow}`)
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'soil_conductivity.csv';
    link.click();

    URL.revokeObjectURL(url);
  };
  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Conductivité du sol et irrigation
        </Text>
        <HStack spacing={2}>
          <Button onClick={handleScreenshot}>
            <FaCamera />
          </Button>
          <Button onClick={handleDownloadData}>
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
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 10, bottom: 30 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />
            <XAxis {...xAxisProps} />
            <YAxis
              yAxisId="left"
              label={{
                value: 'Conductivité',
                angle: -90,
                position: 'insideLeft',
                dx: -10,
                dy: 30,
                fontSize: 15,
                fontFamily: 'Arial, sans-serif',
              }}
              stroke="#666"
              strokeWidth={1}
              tick={{
                fill: '#666',
                fontSize: 17,
                fontFamily: 'Arial, sans-serif',
              }}
              axisLine={{
                stroke: '#666',
                strokeWidth: 1,
              }}
              tickLine={{
                stroke: '#666',
                strokeWidth: 1,
              }}
              
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: 'Irrigation',
                angle: -90,
                position: 'insideRight',
                dy: -30,
                dx: 10,
                fontSize: 15,
                fontFamily: 
                'Arial, sans-serif',
              }}
              stroke="#666"
              strokeWidth={1}
              tick={{
                fill: '#666',
                fontSize: 17,
                fontFamily: 'Arial, sans-serif',
              }}
              axisLine={{
                stroke: '#666',
                strokeWidth: 1,
              }}
              tickLine={{
                stroke: '#666',
                strokeWidth: 1,
              }}
            />
            <Tooltip
              content={<UnifiedTooltip />}
              cursor={defaultTooltipCursor}
            />
            <Legend
              wrapperStyle={defaultLegendWrapperStyle}
              content={<ChartLegend onClick={handleLegendClick} />}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="low"
              name="Conductivité basse (µS/cm)"
              stroke="#1E88E5"
              strokeOpacity={activeLines.low ? 1 : 0.1}
              {...defaultLineProps}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="high"
              name="Conductivité haute (µS/cm)"
              stroke="#2BB673"
              strokeOpacity={activeLines.high ? 1 : 0.1}
              {...defaultLineProps}
            />

            <Bar
              yAxisId="right"
              dataKey="waterflow"
              name="Irrigation"
              fill="#0ea5e9"
              fillOpacity={activeLines.waterflow ? 0.65 : 0.06}
              barSize={10}
              {...defaultBarProps}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default SoilConductivityChart;
