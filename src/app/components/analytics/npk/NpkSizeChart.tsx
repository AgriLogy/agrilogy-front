import React, { useRef, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
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
import { NpkSensorData } from '@/app/types';
import EmptyBox from '../../common/EmptyBox';
import useColorModeStyles from '@/app/utils/useColorModeStyles';

const NpkSizeChart = ({
  data,
  loading,
}: {
  data: NpkSensorData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { textColor } = useColorModeStyles();

  const chartData = data.map((item) => ({
    name: item.timestamp,
    nitrogen: item.nitrogen_value,
    phosphorus: item.phosphorus_value,
    potassium: item.potassium_value,
  }));

  const labelInterval = useBreakpointValue({
    base: Math.ceil(chartData.length / 3),
    md: Math.ceil(chartData.length / 5),
  });

  const labelAngle = useBreakpointValue({ base: -3, md: 5 });

  const [activeLines, setActiveLines] = useState({
    nitrogen: true,
    phosphorus: true,
    potassium: true,
  });

  const handleLegendClick = (e: any) => {
    const key = e.dataKey as keyof typeof activeLines;
    setActiveLines((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'npk_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    const csv =
      'timestamp,nitrogen,phosphorus,potassium\n' +
      data
        .map(
          (d) =>
            `${d.timestamp},${d.nitrogen_value},${d.phosphorus_value},${d.potassium_value}`
        )
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'npk_data.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Évolution des éléments NPK
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
                label={{
                  value: 'Concentration (mg/kg)',
                  angle: -90,
                  position: 'insideLeft',
                  fontSize: 14,
                  dy: 80, // Push down the label slightly

                  
                }}

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
              <Tooltip />
              <Legend onClick={handleLegendClick} />

              <Line
                type="monotone"
                dataKey="nitrogen"
                name={data[0]?.nitrogen_courbe_name || 'Azote (N)'}
                stroke={
                  activeLines.nitrogen
                    ? data[0]?.nitrogen_color || '#dba800'
                    : ''
                }
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="phosphorus"
                name={data[0]?.phosphorus_courbe_name || 'Phosphore (P)'}
                stroke={
                  activeLines.phosphorus
                    ? data[0]?.phosphorus_color || '#00a86b'
                    : ''
                }
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="potassium"
                name={data[0]?.potassium_courbe_name || 'Potassium (K)'}
                stroke={
                  activeLines.potassium
                    ? data[0]?.potassium_color || '#4682b4'
                    : ''
                }
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />

              <Brush
                dataKey="name"
                height={30}
                stroke="#8884d8"
                travellerWidth={8}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default NpkSizeChart;
