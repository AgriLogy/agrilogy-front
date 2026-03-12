import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  CartesianGrid,
  Bar,
  ComposedChart,
} from 'recharts';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaCamera, FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { SensorData } from '@/app/types';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { useRef, useState } from 'react';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';

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

  // Convert flow data into a map for quick access
  const flowMap = new Map(flowData.map((f) => [f.timestamp, f.value]));

  const handleLegendClick = (e: any) => {
    const key = e.dataKey as keyof typeof activeLines;
    setActiveLines((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Merge EC and flow data into a unified structure

  const chartData = lowData.map((item, index) => ({
    timestamp: item.timestamp,
    low: item.value,
    high: highData[index]?.value ?? null,
    waterflow: flowMap.get(item.timestamp) ?? null,
  }));

  const labelInterval = useBreakpointValue({
    base: Math.ceil(chartData.length / 3),
    md: Math.ceil(chartData.length / 5),
  });

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
  const _labelAngle = useBreakpointValue({ base: -3, md: 5 });

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
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              interval={labelInterval}
              angle={0}
              textAnchor="middle"
              stroke="#666" // Axis line color
              strokeWidth={1} // Axis line thickness
              tick={{
                // Tick styling
                fill: '#666', // Tick label color
                fontSize: 17, // Tick label font size
                fontFamily: 'Arial, sans-serif', // Tick label font
              }}
              axisLine={{
                // Main axis line styling
                stroke: '#666',
                strokeWidth: 1,
              }}
              tickLine={{
                // Tick line styling
                stroke: '#666',
                strokeWidth: 1,
              }}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: 'Conductivité',
                angle: -90,
                position: 'insideLeft',
                dy: 70,
                fontSize: 18, // Tick label font size
                fontFamily: 'Arial, sans-serif', // Tick label font
              }}
              stroke="#666" // Axis line color
              strokeWidth={1} // Axis line thickness
              tick={{
                // Tick styling
                fill: '#666', // Tick label color
                fontSize: 17, // Tick label font size
                fontFamily: 'Arial, sans-serif', // Tick label font
              }}
              axisLine={{
                // Main axis line styling
                stroke: '#666',
                strokeWidth: 1,
              }}
              tickLine={{
                // Tick line styling
                stroke: '#666',
                strokeWidth: 1,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: 'Irrigation',
                angle: 90,
                position: 'insideRight',
                dy: 50,
                dx: 19,
                fontSize: 18, // Tick label font size
              }}
            />
            <Tooltip content={<UnifiedTooltip />} />
            {/* <Legend /> */}
            <Legend onClick={handleLegendClick} />

            {/* EC Lines */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="low"
              name="Conductivité Basse"
              stroke="#1E88E5"
              strokeWidth={2}
              strokeOpacity={activeLines.low ? 1 : 0.1}
              dot={false}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="high"
              name="Conductivité Haute"
              stroke="#2BB673"
              strokeWidth={2}
              strokeOpacity={activeLines.high ? 1 : 0.1}
              dot={false}
            />

            <Bar
              yAxisId="right"
              dataKey="waterflow"
              name="Irrigation"
              fill="#00B0FF"
              stroke="#0091EA"
              barSize={10}
              fillOpacity={activeLines.waterflow ? 0.7 : 0.05}
            />

            <Brush dataKey="timestamp" height={30} stroke="#8884d8" />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default SoilConductivityChart;
