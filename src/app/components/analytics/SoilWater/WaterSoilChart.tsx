import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { FaCamera, FaDownload } from 'react-icons/fa';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { ThresholdBand, WaterSoilData } from '@/app/types';
import ChartStateView from '../../common/ChartStateView';
import UnifiedTooltip from '../../common/UnifiedTooltip';
import {
  defaultCartesianGridProps,
  defaultTooltipCursor,
  getDefaultXAxisProps,
} from '@/app/utils/chartAxisConfig';

const WaterSoilChart = ({
  data,
  thresholds,
  targetAxis = 'left', // which Y axis the bands align to
  loading = false,
}: {
  data: WaterSoilData[];
  thresholds: ThresholdBand;
  targetAxis?: 'left' | 'right';
  loading?: boolean;
}) => {
  const { critical_min, critical_max, normal_min, normal_max } = thresholds;

  const xAxisProps = getDefaultXAxisProps(data, 'timestamp');
  const chartRef = useRef<HTMLDivElement>(null);

  const handleScreenshot = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = 'water_soil_data.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleDownloadData = () => {
    const headers = [
      'timestamp',
      'soilLow',
      'soilMedium',
      'soilHigh',
      'waterFlow',
    ];
    const csv =
      headers.join(',') +
      '\n' +
      data
        .map((d) =>
          [
            d.timestamp,
            d.soilLow ?? '',
            d.soilMedium ?? '',
            d.soilHigh ?? '',
            d.waterFlow ?? '',
          ].join(',')
        )
        .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'water_soil_data.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  const { textColor } = useColorModeStyles();

  // X range for the background areas (span the whole chart)
  const [xStart, xEnd] = useMemo(() => {
    if (!data?.length) return [undefined, undefined] as const;
    return [data[0].timestamp, data[data.length - 1].timestamp] as const;
  }, [data]);

  return (
    <Box width="100%" height="100%">
      <Flex justify="space-between" align="center" mb={1}>
        <Text fontSize="xl" fontWeight="bold" mb={2} color={textColor}>
          Eau disponible
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

      {/* Inline legend for bands (since Legend payload would override series legend) */}
      <HStack spacing={4} mb={3}>
        <HStack spacing={2}>
          <Box
            w="12px"
            h="12px"
            bg="#ef4444"
            opacity={0.5}
            borderRadius="2px"
          />
          <Text fontSize="sm" color={textColor}>
            Zone critique
          </Text>
        </HStack>
        <HStack spacing={2}>
          <Box
            w="12px"
            h="12px"
            bg="#3b82f6"
            opacity={0.5}
            borderRadius="2px"
          />
          <Text fontSize="sm" color={textColor}>
            Zone normale
          </Text>
        </HStack>
      </HStack>

      <ChartStateView
        loading={loading}
        empty={!data?.length}
        emptyText="Aucune donnée à afficher."
        chartRef={chartRef}
        height={300}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 16, right: 24, left: 8, bottom: 40 }}
          >
            <CartesianGrid {...defaultCartesianGridProps} />

            {/* Background bands — render BEFORE series so they appear behind */}
            {xStart !== undefined && xEnd !== undefined && (
              <>
                {/* Critical band (red) */}
                <ReferenceArea
                  x1={xStart}
                  x2={xEnd}
                  yAxisId={targetAxis}
                  y1={critical_min}
                  y2={critical_max}
                  fill="#ef4444"
                  fillOpacity={0.12}
                  strokeOpacity={0}
                  ifOverflow="hidden"
                />
                {/* Normal band (blue) */}
                <ReferenceArea
                  x1={xStart}
                  x2={xEnd}
                  yAxisId={targetAxis}
                  y1={normal_min}
                  y2={normal_max}
                  fill="#3b82f6"
                  fillOpacity={0.12}
                  strokeOpacity={0}
                  ifOverflow="hidden"
                />
              </>
            )}

            <XAxis
              dataKey="timestamp"
              {...xAxisProps}
              angle={0}
              textAnchor="middle"
              // interval={labelInterval}
            />

            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              label={{
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

            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 'auto']}
              label={{
                value: 'Irrigation (L/s)',
                angle: 90,
                position: 'inside',
                dx: 20,
                fontSize: 18, // Tick label font size
                fontFamily: 'Arial, sans-serif', // Tick label font
              }}
              tick={{
                // Tick styling
                fill: '#666', // Tick label color
                fontSize: 17, // Tick label font size
                fontFamily: 'Arial, sans-serif', // Tick label font
              }}
            />

            <Tooltip
              content={<UnifiedTooltip />}
              cursor={defaultTooltipCursor}
            />
            <Legend />

            {/* Soil moisture lines */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="waterFlow"
              name="Irrigation (L/s)"
              fill="#b3e5fc"
              stroke="#0288d1"
              strokeWidth={2}
              fillOpacity={0.5}
              connectNulls={true}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: 'white' }}
              isAnimationActive={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="soilLow"
              name="Humidité basse (%)"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: 'white' }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="soilMedium"
              name="Humidité moyenne (%)"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: 'white' }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="soilHigh"
              name="Humidité haute (%)"
              stroke="#ffc658"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: 'white' }}
            />

            {/* Water flow area */}
          </LineChart>
        </ResponsiveContainer>
      </ChartStateView>
    </Box>
  );
};

export default WaterSoilChart;
