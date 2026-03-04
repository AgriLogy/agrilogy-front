import React, { useRef, useState } from 'react';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  useBreakpointValue,
  Box,
  Flex,
  Text,
  Button,
  HStack,
  useColorMode,
} from '@chakra-ui/react';
import { FaDownload, FaCamera } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { SensorData } from '@/app/types';
import EmptyBox from '../../common/EmptyBox';
import useColorModeStyles from '@/app/utils/useColorModeStyles';

const PrecipitationRateChart = ({
  data,
  loading,
}: {
  data: SensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(true);

  const chartData = data.map((item) => ({
    name: item.timestamp,
    value: item.value,
  }));

  const labelInterval = useBreakpointValue({
    base: Math.ceil(chartData.length / 3),
    md: Math.ceil(chartData.length / 5),
  });

  const _labelAngle = useBreakpointValue({ base: -3, md: 5 });
  const { textColor } = useColorModeStyles();

  // Legend click handler
  const handleLegendClick = (data: any) => {
    if (data.value === 'Taille des fruits') {
      setShowBar((prev) => !prev);
    }
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'precipitation_rate.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      'timestamp,value\n' +
      data.map((d) => `${d.timestamp},${d.value}`).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'fruit_data.csv';
    link.click();

    URL.revokeObjectURL(url);
  };
  const { colorMode } = useColorMode();
  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Taux de précipitation
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

      <Box ref={chartRef} height="300px">
        {loading ? (
          <EmptyBox text="Chargement..." />
        ) : data.length === 0 ? (
          <EmptyBox text="Pas de données" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              onClick={(_e) => {
                // optional: if you want to toggle bar by clicking legend label only
              }}
            >
              <XAxis
                dataKey="name"
                angle={0}
                textAnchor="middle"
                interval={labelInterval}
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
                label={{
                  // value: "Taille (mm)",
                  angle: -90,
                  position: 'insideLeft',
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
              <Tooltip />
              <Legend onClick={handleLegendClick} />
              <Bar
                dataKey="value"
                name="Taux de précipitation (mm/h)"
                fill={colorMode === 'dark' ? '#60a5fa' : '#3b82f6'}
                activeBar={
                  <Rectangle
                    fill={showBar ? 'gold' : 'gray'}
                    stroke={showBar ? 'purple' : 'gray'}
                  />
                }
                isAnimationActive={false}
                style={{
                  pointerEvents: showBar ? 'auto' : 'none',
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default PrecipitationRateChart;
