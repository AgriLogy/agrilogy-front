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
import {
  useBreakpointValue,
  Box,
  Flex,
  Text,
  Button,
  HStack,
} from '@chakra-ui/react';
import { FaDownload, FaCamera } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { SensorData } from '@/app/types';
import { roundNumber } from '@/app/utils/formatNumber';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import useColorModeStyles from '@/app/utils/useColorModeStyles';

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

  const chartData = data.map((item) => ({
    name: item.timestamp,
    value: roundNumber(item.value),
    wind_gust: item.wind_gust != null ? roundNumber(item.wind_gust) : undefined,
  }));

  const labelInterval = useBreakpointValue({
    base: Math.ceil(chartData.length / 3),
    md: Math.ceil(chartData.length / 5),
  });

  const _labelAngle = useBreakpointValue({ base: -3, md: 5 });
  const { textColor } = useColorModeStyles();

  const handleLegendClick = (data: any) => {
    if (data.value === 'Vitesse du vent (km/h)') {
      setShowLine((prev) => !prev);
    }
    if (data.value === 'Rafale du vent (km/h)') {
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
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
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
                // value: "Vitesse du vent (km/h)",
                angle: -90,
                fontSize: 16,
                dy: 80,
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
            <Tooltip content={<UnifiedTooltip />} />
            <Legend onClick={handleLegendClick} />
            <Line
              type="monotone"
              dataKey="value"
              name="Vitesse du vent (km/h)"
              stroke={showLine ? '#82ca9d' : 'gray'}
              strokeWidth={2}
              dot={{ r: 4, fill: showLine ? '#82ca9d' : 'gray' }}
              activeDot={{ r: 6, stroke: showLine ? '#2f855a' : 'gray' }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="wind_gust"
              name="Rafale du vent (km/h)"
              stroke={showGust ? '#ed8936' : 'gray'}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: showGust ? '#ed8936' : 'gray' }}
              activeDot={{ r: 6, stroke: showGust ? '#c05621' : 'gray' }}
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
