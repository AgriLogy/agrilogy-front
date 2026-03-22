'use client';

import React, { useRef } from 'react';
import {
  Box,
  Text,
  Button,
  HStack,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import ChartStateView from '../../common/ChartStateView';
import { FaCamera, FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  Chart,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import { formatNumber } from '@/app/utils/formatNumber';

// Helper: get pixel radius from scale value (Chart.js 4 radial scale)
function getRadiusForValue(scale: any, value: number): number {
  if (typeof scale.getDistanceFromCenterForValue === 'function') {
    return scale.getDistanceFromCenterForValue(value);
  }
  const min = scale.min ?? 0;
  const max = scale.max ?? 1;
  const length = scale._length ?? 0;
  const maxRadius = length / 2;
  if (maxRadius <= 0 || max <= min) return 0;
  return ((value - min) / (max - min)) * maxRadius;
}

// Plugin to stack polar-area datasets so each radial segment shows stacked speed colors
const stackedPolarAreaPlugin = {
  id: 'stackedPolarArea',
  // Run immediately before drawing so our radii are used (after layout, no overwrite)
  beforeDatasetsDraw: (chart: Chart) => {
    const scale = chart.scales.r as any;
    const labelsLength = chart.data.labels?.length ?? 0;
    if (!scale) return;

    for (let dataIndex = 0; dataIndex < labelsLength; dataIndex++) {
      let cumulative = 0;

      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const value = dataset.data?.[dataIndex];
        if (typeof value !== 'number') return;

        const meta = chart.getDatasetMeta(datasetIndex);
        const arc = meta.data?.[dataIndex] as any;
        if (!arc) return;

        arc.innerRadius = getRadiusForValue(scale, cumulative);
        arc.outerRadius = getRadiusForValue(scale, cumulative + value);

        cumulative += value;
      });
    }
  },
};

// Draw a single “frequency axis” line with tick labels (classic wind-rose style).
// This makes the radial frequency scale readable on one vertical radius.
const frequencyAxisPlugin = {
  id: 'frequencyAxis',
  afterDraw: (chart: any) => {
    const scale = chart?.scales?.r;
    if (!scale) return;

    const ctx = chart.ctx;
    const ticks = scale.ticks ?? [];
    if (!ticks.length) return;

    const centerX = scale.xCenter;
    const centerY = scale.yCenter;
    const labelColor = '#000000';

    ctx.save();

    // Minimal: just write values (no axis line, no tick marks, no backdrop)
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    ticks.forEach((t: any) => {
      const v = typeof t.value === 'number' ? t.value : Number(t.value);
      if (!Number.isFinite(v) || v === 0) return;

      const r = getRadiusForValue(scale, v);
      const y = centerY - r;

      const label = `${v}%`;
      ctx.fillStyle = labelColor;
      ctx.fillText(label, centerX + 10, y);
    });

    ctx.restore();
  },
};

// Register Chart.js modules + plugin
ChartJS.register(
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  stackedPolarAreaPlugin,
  frequencyAxisPlugin
);

interface WindData {
  timestamp: string;
  value: number;
  default_unit: string;
}

// Exact color palette from your target image
const SPEED_BINS = [
  // Finer bins so distribution is more readable
  { label: '< 1 m/s', min: 0, max: 1, color: '#7cb5ec' },
  { label: '1 - 2 m/s', min: 1, max: 2, color: '#434348' },
  { label: '2 - 3 m/s', min: 2, max: 3, color: '#90ed7d' },
  { label: '3 - 4 m/s', min: 3, max: 4, color: '#f7a35c' },
  { label: '4 - 5 m/s', min: 4, max: 5, color: '#8085e9' },
  { label: '5 - 6 m/s', min: 5, max: 6, color: '#f15c80' },
  { label: '6 - 7 m/s', min: 6, max: 7, color: '#e4d354' },
  { label: '7 - 8 m/s', min: 7, max: 8, color: '#2b908f' },
  { label: '8 - 10 m/s', min: 8, max: 10, color: '#91e8e1' },
  { label: '10 - 12 m/s', min: 10, max: 12, color: '#7cb5ec' },
  { label: '> 12 m/s', min: 12, max: Infinity, color: '#434348' },
];

function speedToMps(speed: WindData): number {
  const unit = String(speed.default_unit ?? '').toLowerCase();
  const v = typeof speed.value === 'number' ? speed.value : Number(speed.value);
  if (!Number.isFinite(v)) return NaN;
  // Common case: API returns wind speed in km/h but labels/bins are m/s.
  // Convert km/h -> m/s
  if (unit.includes('km') || unit.includes('km/h') || unit.includes('kph')) {
    return v / 3.6;
  }
  return v; // assume already m/s
}

const LABELS_16_POINT = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
];

const getCompassSector = (degrees: number): string => {
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return LABELS_16_POINT[index];
};

const prepareWindRoseData = (
  speedData: WindData[],
  directionData: WindData[]
) => {
  const countsMap: Record<string, Record<string, number>> = {};
  LABELS_16_POINT.forEach((dir) => {
    countsMap[dir] = {};
    SPEED_BINS.forEach((bin) => {
      countsMap[dir][bin.label] = 0;
    });
  });

  const limit = Math.min(speedData.length, directionData.length);
  let totalValidPoints = 0;

  for (let i = 0; i < limit; i++) {
    const speed = speedData[i];
    const direction = directionData[i];

    if (
      speed &&
      direction &&
      speed.timestamp === direction.timestamp &&
      typeof speed.value === 'number' &&
      typeof direction.value === 'number'
    ) {
      const sector = getCompassSector(direction.value);
      const speedVal = speedToMps(speed);
      const matchingBin = SPEED_BINS.find(
        (b) => speedVal >= b.min && speedVal < b.max
      );

      if (matchingBin) {
        countsMap[sector][matchingBin.label]++;
        totalValidPoints++;
      }
    }
  }

  if (totalValidPoints === 0) {
    return {
      chartData: { labels: LABELS_16_POINT, datasets: [] },
      pctMap: {},
      countsMap: {},
      maxStacked: 0,
    };
  }

  // Convert raw counts to percentages
  const pctMap: Record<string, Record<string, number>> = {};
  LABELS_16_POINT.forEach((dir) => {
    pctMap[dir] = {};
    SPEED_BINS.forEach((bin) => {
      pctMap[dir][bin.label] =
        (countsMap[dir][bin.label] / totalValidPoints) * 100;
    });
  });

  // Build datasets with actual percentages (stacking handled by plugin)
  const datasets = SPEED_BINS.map((bin) => {
    const realPercentages = LABELS_16_POINT.map(
      (dir) => pctMap[dir][bin.label]
    );
    const realCounts = LABELS_16_POINT.map((dir) => countsMap[dir][bin.label]);

    return {
      label: bin.label,
      data: realPercentages,
      realData: realPercentages,
      realCounts: realCounts,
      backgroundColor: LABELS_16_POINT.map(() => bin.color),
      borderColor: LABELS_16_POINT.map(() => '#ffffff'),
      borderWidth: 1,
    };
  });

  const maxStacked = Math.max(
    ...LABELS_16_POINT.map((dir) =>
      SPEED_BINS.reduce((sum, bin) => sum + pctMap[dir][bin.label], 0)
    )
  );

  return {
    chartData: {
      labels: LABELS_16_POINT,
      datasets: datasets,
    },
    pctMap,
    countsMap,
    maxStacked,
  };
};

const WindRadarChart = ({
  windSpeedData,
  windDirectionData,
  loading,
}: {
  windSpeedData: WindData[];
  windDirectionData: WindData[];
  loading: boolean;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const gridColor = useColorModeValue(
    'rgba(0, 0, 0, 0.1)',
    'rgba(255, 255, 255, 0.1)'
  );
  const axisLineColor = useColorModeValue(
    'rgba(0, 0, 0, 0.3)',
    'rgba(255, 255, 255, 0.3)'
  );
  const backdropColor = useColorModeValue(
    'rgba(255, 255, 255, 0.85)',
    'rgba(26, 32, 44, 0.85)'
  );

  const { chartData, pctMap, countsMap, maxStacked } = prepareWindRoseData(
    windSpeedData,
    windDirectionData
  );
  const isDataEmpty = !chartData || chartData.datasets.length === 0;

  const chartOptions: ChartOptions<'polarArea'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        suggestedMax: Math.max(6, Math.ceil(maxStacked + 1)),
        angleLines: {
          display: true,
          color: axisLineColor,
          lineWidth: 0.4,
        },
        grid: {
          color: gridColor,
          circular: true,
        },
        ticks: {
          stepSize: 2,
          display: true,
          color: textColor,
          // Transparent: no background box behind radial tick labels
          backdropColor: 'transparent',
          backdropPadding: 0,
          z: 10,
          callback: (value: any) => {
            // If the value is 0 (the center point), return an empty string to hide it
            if (value === 0) {
              return '';
            }
            // Otherwise, write the number followed by a percentage sign
            return `${value}%`;
          },
        },
        pointLabels: {
          display: true,
          color: textColor,
          font: { size: 12 },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'right',
        reverse: false,
        onClick: () => {},
        labels: {
          color: textColor,
          usePointStyle: true,
          padding: 20,
          generateLabels: (chart: any) => {
            const datasets = chart.data.datasets;
            return datasets.map((dataset: any, i: number) => ({
              text: dataset.label,
              fillStyle: dataset.backgroundColor[0],
              strokeStyle: dataset.borderColor[0],
              lineWidth: dataset.borderWidth,
              hidden: false,
              datasetIndex: i,
            }));
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const dataset = context.dataset;
            const realValue = dataset.realData[context.dataIndex];
            const countValue = dataset.realCounts[context.dataIndex];

            if (realValue === 0) return undefined;

            return ` ${dataset.label}: ${formatNumber(realValue, 1)}% (${countValue} mesures)`;
          },
        },
      },
    },
  };

  const handleScreenshot = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = 'wind_direction_chart.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleDownloadData = () => {
    if (isDataEmpty) return;

    const headers = [
      'Direction',
      ...SPEED_BINS.map((b) => `${b.label} (%)`),
      ...SPEED_BINS.map((b) => `${b.label} (Count)`),
    ];
    const rows = LABELS_16_POINT.map((dir) => {
      const pctData = SPEED_BINS.map(
        (bin) => formatNumber(pctMap[dir][bin.label], 2) + '%'
      );
      const countData = SPEED_BINS.map((bin) =>
        countsMap[dir][bin.label].toString()
      );
      return [dir, ...pctData, ...countData].join(',');
    });

    const csv = headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wind_direction_data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box width="100%" pr={4} pb={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Direction de vent
        </Text>
        <HStack spacing={2}>
          <Button
            aria-label="Capture"
            colorScheme="teal"
            variant="ghost"
            onClick={handleScreenshot}
          >
            <FaCamera />
          </Button>
          <Button
            aria-label="Export"
            colorScheme="blue"
            variant="ghost"
            onClick={handleDownloadData}
            isDisabled={isDataEmpty}
          >
            <FaDownload />
          </Button>
        </HStack>
      </Flex>

      <ChartStateView
        loading={loading}
        empty={isDataEmpty}
        emptyText="Aucune donnée disponible"
        chartRef={chartRef}
        height="400px"
      >
        <PolarArea data={chartData as any} options={chartOptions} />
      </ChartStateView>
    </Box>
  );
};

export default WindRadarChart;




// 'use client';

// import React, { useRef } from 'react';
// import {
//   Box,
//   Text,
//   Button,
//   HStack,
//   Flex,
//   useColorModeValue,
// } from '@chakra-ui/react';
// import ChartStateView from '../../common/ChartStateView';
// import { FaCamera, FaDownload } from 'react-icons/fa';
// import html2canvas from 'html2canvas';
// import {
//   Chart as ChartJS,
//   RadialLinearScale,
//   ArcElement,
//   Tooltip,
//   Legend,
//   ChartOptions,
//   Chart,
// } from 'chart.js';
// import { PolarArea } from 'react-chartjs-2';

// function getRadiusForValue(scale: any, value: number): number {
//   if (typeof scale.getDistanceFromCenterForValue === 'function') {
//     return scale.getDistanceFromCenterForValue(value);
//   }
//   const min = scale.min ?? 0;
//   const max = scale.max ?? 1;
//   const length = scale._length ?? 0;
//   const maxRadius = length / 2;
//   if (maxRadius <= 0 || max <= min) return 0;
//   return ((value - min) / (max - min)) * maxRadius;
// }

// const SPEED_BINS = [
//   { label: '< 2 m/s', min: 0, max: 2, color: '#7cb5ec' },
//   { label: '2 - 4 m/s', min: 2, max: 4, color: '#434348' },
//   { label: '4 - 6 m/s', min: 4, max: 6, color: '#90ed7d' },
//   { label: '6 - 8 m/s', min: 6, max: 8, color: '#f7a35c' },
//   { label: '> 8 m/s', min: 8, max: Infinity, color: '#8085e9' },
// ];

// const LABELS_16_POINT = [
//   'N','NNE','NE','ENE','E','ESE','SE','SSE',
//   'S','SSW','SW','WSW','W','WNW','NW','NNW'
// ];

// const getCompassSector = (degrees: number): string => {
//   const normalized = ((degrees % 360) + 360) % 360;
//   const index = Math.round(normalized / 22.5) % 16;
//   return LABELS_16_POINT[index];
// };





// /* ---------------- STACKED POLAR PLUGIN ---------------- */

// const stackedPolarAreaPlugin = {
//   id: 'stackedPolarArea',
//   beforeDatasetsDraw: (chart: Chart) => {
//     const scale = chart.scales.r as any;
//     const labelsLength = chart.data.labels?.length ?? 0;

//     if (!scale) return;

//     for (let dataIndex = 0; dataIndex < labelsLength; dataIndex++) {

//       let cumulative = 0;

//       chart.data.datasets.forEach((dataset, datasetIndex) => {

//         const value = dataset.data?.[dataIndex];
//         if (typeof value !== 'number') return;

//         const meta = chart.getDatasetMeta(datasetIndex);
//         const arc = meta.data?.[dataIndex] as any;

//         if (!arc) return;

//         arc.innerRadius = getRadiusForValue(scale, cumulative);
//         arc.outerRadius = getRadiusForValue(scale, cumulative + value);

//         cumulative += value;

//       });
//     }
//   },
// };






// /* ---------------- RADIAL COLOR BACKGROUND ---------------- */

// const radialSpeedBackgroundPlugin = {
//   id: 'radialSpeedBackground',

//   beforeDraw(chart: Chart) {

//     const { ctx } = chart;
//     const scale: any = chart.scales.r;

//     if (!scale) return;

//     ctx.save();

//     SPEED_BINS.forEach((bin) => {

//       const inner = getRadiusForValue(scale, bin.min);

//       const outer =
//         bin.max === Infinity
//           ? getRadiusForValue(scale, scale.max)
//           : getRadiusForValue(scale, bin.max);

//       ctx.beginPath();

//       ctx.arc(scale.xCenter, scale.yCenter, outer, 0, Math.PI * 2);
//       ctx.arc(scale.xCenter, scale.yCenter, inner, 0, Math.PI * 2, true);

//       ctx.closePath();

//       ctx.fillStyle = bin.color;
//       ctx.globalAlpha = 0.12;
//       ctx.fill();
//     });

//     ctx.restore();
//   },
// };






// ChartJS.register(
//   RadialLinearScale,
//   ArcElement,
//   Tooltip,
//   Legend,
//   stackedPolarAreaPlugin,
//   radialSpeedBackgroundPlugin
// );





// interface WindData {
//   timestamp: string;
//   value: number;
//   default_unit: string;
// }





// const prepareWindRoseData = (
//   speedData: WindData[],
//   directionData: WindData[]
// ) => {

//   const countsMap: Record<string, Record<string, number>> = {};

//   LABELS_16_POINT.forEach((dir) => {

//     countsMap[dir] = {};

//     SPEED_BINS.forEach((bin) => {
//       countsMap[dir][bin.label] = 0;
//     });

//   });

//   const limit = Math.min(speedData.length, directionData.length);

//   let totalValidPoints = 0;

//   for (let i = 0; i < limit; i++) {

//     const speed = speedData[i];
//     const direction = directionData[i];

//     if (
//       speed &&
//       direction &&
//       speed.timestamp === direction.timestamp &&
//       typeof speed.value === 'number' &&
//       typeof direction.value === 'number'
//     ) {

//       const sector = getCompassSector(direction.value);
//       const speedVal = speed.value;

//       const matchingBin = SPEED_BINS.find(
//         (b) => speedVal >= b.min && speedVal < b.max
//       );

//       if (matchingBin) {
//         countsMap[sector][matchingBin.label]++;
//         totalValidPoints++;
//       }

//     }
//   }

//   if (totalValidPoints === 0) {
//     return {
//       chartData: { labels: LABELS_16_POINT, datasets: [] },
//       pctMap: {},
//       countsMap: {},
//       maxStacked: 0,
//     };
//   }

//   const pctMap: Record<string, Record<string, number>> = {};

//   LABELS_16_POINT.forEach((dir) => {

//     pctMap[dir] = {};

//     SPEED_BINS.forEach((bin) => {

//       pctMap[dir][bin.label] =
//         (countsMap[dir][bin.label] / totalValidPoints) * 100;

//     });

//   });




//   const datasets = SPEED_BINS.map((bin) => {

//     const realPercentages = LABELS_16_POINT.map(
//       (dir) => pctMap[dir][bin.label]
//     );

//     const realCounts = LABELS_16_POINT.map(
//       (dir) => countsMap[dir][bin.label]
//     );

//     return {
//       label: bin.label,
//       data: realPercentages,
//       realData: realPercentages,
//       realCounts: realCounts,
//       backgroundColor: LABELS_16_POINT.map(() => bin.color),
//       borderColor: LABELS_16_POINT.map(() => '#ffffff'),
//       borderWidth: 1,
//     };
//   });




//   const maxStacked = Math.max(
//     ...LABELS_16_POINT.map((dir) =>
//       SPEED_BINS.reduce((sum, bin) => sum + pctMap[dir][bin.label], 0)
//     )
//   );

//   return {
//     chartData: {
//       labels: LABELS_16_POINT,
//       datasets: datasets,
//     },
//     pctMap,
//     countsMap,
//     maxStacked,
//   };
// };







// const WindRadarChart = ({
//   windSpeedData,
//   windDirectionData,
//   loading,
// }: {
//   windSpeedData: WindData[];
//   windDirectionData: WindData[];
//   loading: boolean;
// }) => {

//   const chartRef = useRef<HTMLDivElement>(null);

//   const textColor = useColorModeValue('gray.800', 'gray.200');

//   const axisLineColor = useColorModeValue(
//     'rgba(0,0,0,0.3)',
//     'rgba(255,255,255,0.3)'
//   );

//   const backdropColor = useColorModeValue(
//     'rgba(255,255,255,0.85)',
//     'rgba(26,32,44,0.85)'
//   );




//   const { chartData, pctMap, countsMap, maxStacked } =
//     prepareWindRoseData(windSpeedData, windDirectionData);

//   const isDataEmpty = !chartData || chartData.datasets.length === 0;





//   const chartOptions: ChartOptions<'polarArea'> = {

//     responsive: true,
//     maintainAspectRatio: false,

//     scales: {
//       r: {

//         min: 0,
//         suggestedMax: Math.max(6, Math.ceil(maxStacked + 1)),

//         angleLines: {
//           display: true,
//           color: axisLineColor,
//           lineWidth: 0.4,
//         },

//         grid: {
//           display: false,
//         },

//         ticks: {
//           stepSize: 2,
//           display: true,
//           color: 'black',
//           backdropColor: backdropColor,
//           backdropPadding: 3,
//           z: 10,

//           callback: (value: any) => {
//             if (value === 0) return '';
//             return `${value}%`;
//           },
//         },

//         pointLabels: {
//           display: true,
//           color: textColor,
//           font: { size: 12 },
//         },
//       },
//     },



//     plugins: {

//       legend: {

//         display: true,
//         position: 'right',
//         onClick: () => {},

//         labels: {
//           color: textColor,
//           usePointStyle: true,
//           padding: 20,

//           generateLabels: (chart: any) => {

//             const datasets = chart.data.datasets;

//             return datasets.map((dataset: any, i: number) => ({
//               text: dataset.label,
//               fillStyle: dataset.backgroundColor[0],
//               strokeStyle: dataset.borderColor[0],
//               lineWidth: dataset.borderWidth,
//               hidden: false,
//               datasetIndex: i,
//             }));

//           },
//         },
//       },



//       tooltip: {

//         callbacks: {

//           label: (context: any) => {

//             const dataset = context.dataset;

//             const realValue = dataset.realData[context.dataIndex];
//             const countValue = dataset.realCounts[context.dataIndex];

//             if (realValue === 0) return undefined;

//             return ` ${dataset.label}: ${realValue.toFixed(1)}% (${countValue} mesures)`;

//           },
//         },
//       },
//     },
//   };





//   const handleScreenshot = async () => {

//     if (!chartRef.current) return;

//     const canvas = await html2canvas(chartRef.current, {
//       scale: 2,
//       backgroundColor: null,
//     });

//     const link = document.createElement('a');
//     link.download = 'wind_direction_chart.png';
//     link.href = canvas.toDataURL();
//     link.click();
//   };



//   const handleDownloadData = () => {

//     if (isDataEmpty) return;

//     const headers = [
//       'Direction',
//       ...SPEED_BINS.map((b) => `${b.label} (%)`),
//       ...SPEED_BINS.map((b) => `${b.label} (Count)`),
//     ];

//     const rows = LABELS_16_POINT.map((dir) => {

//       const pctData = SPEED_BINS.map(
//         (bin) => pctMap[dir][bin.label].toFixed(2) + '%'
//       );

//       const countData = SPEED_BINS.map(
//         (bin) => countsMap[dir][bin.label].toString()
//       );

//       return [dir, ...pctData, ...countData].join(',');

//     });

//     const csv = headers.join(',') + '\n' + rows.join('\n');

//     const blob = new Blob([csv], { type: 'text/csv' });

//     const url = URL.createObjectURL(blob);

//     const link = document.createElement('a');

//     link.href = url;
//     link.download = 'wind_direction_data.csv';
//     link.click();

//     URL.revokeObjectURL(url);
//   };





//   return (

//     <Box width="100%" pr={4} pb={4}>

//       <Flex justify="space-between" align="center" mb={4}>

//         <Text fontSize="xl" fontWeight="bold" color={textColor}>
//           Direction de vent
//         </Text>

//         <HStack spacing={2}>

//           <Button
//             aria-label="Capture"
//             colorScheme="teal"
//             variant="ghost"
//             onClick={handleScreenshot}
//           >
//             <FaCamera />
//           </Button>

//           <Button
//             aria-label="Export"
//             colorScheme="blue"
//             variant="ghost"
//             onClick={handleDownloadData}
//             isDisabled={isDataEmpty}
//           >
//             <FaDownload />
//           </Button>

//         </HStack>
//       </Flex>





//       <ChartStateView
//         loading={loading}
//         empty={isDataEmpty}
//         emptyText="Aucune donnée disponible"
//         chartRef={chartRef}
//         height="400px"
//       >

//         <PolarArea data={chartData as any} options={chartOptions} />

//       </ChartStateView>

//     </Box>
//   );
// };

// export default WindRadarChart;







// 'use client';

// import React, { useRef } from 'react';
// import {
//   Box,
//   Text,
//   Button,
//   HStack,
//   Flex,
//   useColorModeValue,
// } from '@chakra-ui/react';
// import ChartStateView from '../../common/ChartStateView';
// import { FaCamera, FaDownload } from 'react-icons/fa';
// import html2canvas from 'html2canvas';
// import {
//   Chart as ChartJS,
//   RadialLinearScale,
//   ArcElement,
//   Tooltip,
//   Legend,
//   ChartOptions,
//   Chart,
// } from 'chart.js';
// import { PolarArea } from 'react-chartjs-2';

// function getRadiusForValue(scale: any, value: number): number {
//   if (typeof scale.getDistanceFromCenterForValue === 'function') {
//     return scale.getDistanceFromCenterForValue(value);
//   }
//   const min = scale.min ?? 0;
//   const max = scale.max ?? 1;
//   const length = scale._length ?? 0;
//   const maxRadius = length / 2;
//   if (maxRadius <= 0 || max <= min) return 0;
//   return ((value - min) / (max - min)) * maxRadius;
// }

// const stackedPolarAreaPlugin = {
//   id: 'stackedPolarArea',
//   beforeDatasetsDraw: (chart: Chart) => {
//     const scale = chart.scales.r as any;
//     const labelsLength = chart.data.labels?.length ?? 0;

//     if (!scale) return;

//     for (let dataIndex = 0; dataIndex < labelsLength; dataIndex++) {

//       let cumulative = 0;

//       chart.data.datasets.forEach((dataset, datasetIndex) => {

//         const value = dataset.data?.[dataIndex];
//         if (typeof value !== 'number') return;

//         const meta = chart.getDatasetMeta(datasetIndex);
//         const arc = meta.data?.[dataIndex] as any;

//         if (!arc) return;

//         arc.innerRadius = getRadiusForValue(scale, cumulative);
//         arc.outerRadius = getRadiusForValue(scale, cumulative + value);

//         cumulative += value;

//       });
//     }
//   },
// };

// ChartJS.register(
//   RadialLinearScale,
//   ArcElement,
//   Tooltip,
//   Legend,
//   stackedPolarAreaPlugin
// );

// interface WindData {
//   timestamp: string;
//   value: number;
//   default_unit: string;
// }

// const SPEED_BINS = [
//   { label: '< 2 m/s', min: 0, max: 2, color: '#7cb5ec' },
//   { label: '2 - 4 m/s', min: 2, max: 4, color: '#434348' },
//   { label: '4 - 6 m/s', min: 4, max: 6, color: '#90ed7d' },
//   { label: '6 - 8 m/s', min: 6, max: 8, color: '#f7a35c' },
//   { label: '> 8 m/s', min: 8, max: Infinity, color: '#8085e9' },
// ];

// const LABELS_16_POINT = [
//   'N','NNE','NE','ENE','E','ESE','SE','SSE',
//   'S','SSW','SW','WSW','W','WNW','NW','NNW'
// ];

// const getCompassSector = (degrees: number): string => {
//   const normalized = ((degrees % 360) + 360) % 360;
//   const index = Math.round(normalized / 22.5) % 16;
//   return LABELS_16_POINT[index];
// };

// const prepareWindRoseData = (
//   speedData: WindData[],
//   directionData: WindData[]
// ) => {

//   const countsMap: Record<string, Record<string, number>> = {};

//   LABELS_16_POINT.forEach((dir) => {
//     countsMap[dir] = {};
//     SPEED_BINS.forEach((bin) => {
//       countsMap[dir][bin.label] = 0;
//     });
//   });

//   const limit = Math.min(speedData.length, directionData.length);
//   let totalValidPoints = 0;

//   for (let i = 0; i < limit; i++) {

//     const speed = speedData[i];
//     const direction = directionData[i];

//     if (
//       speed &&
//       direction &&
//       speed.timestamp === direction.timestamp &&
//       typeof speed.value === 'number' &&
//       typeof direction.value === 'number'
//     ) {

//       const sector = getCompassSector(direction.value);
//       const speedVal = speed.value;

//       const matchingBin = SPEED_BINS.find(
//         (b) => speedVal >= b.min && speedVal < b.max
//       );

//       if (matchingBin) {
//         countsMap[sector][matchingBin.label]++;
//         totalValidPoints++;
//       }
//     }
//   }

//   if (totalValidPoints === 0) {
//     return {
//       chartData: { labels: LABELS_16_POINT, datasets: [] },
//       pctMap: {},
//       countsMap: {},
//       maxStacked: 0,
//     };
//   }

//   const pctMap: Record<string, Record<string, number>> = {};

//   LABELS_16_POINT.forEach((dir) => {
//     pctMap[dir] = {};
//     SPEED_BINS.forEach((bin) => {
//       pctMap[dir][bin.label] =
//         (countsMap[dir][bin.label] / totalValidPoints) * 100;
//     });
//   });

//   const datasets = SPEED_BINS.map((bin) => {

//     const realPercentages = LABELS_16_POINT.map(
//       (dir) => pctMap[dir][bin.label]
//     );

//     const realCounts = LABELS_16_POINT.map(
//       (dir) => countsMap[dir][bin.label]
//     );

//     return {
//       label: bin.label,
//       data: realPercentages,
//       realData: realPercentages,
//       realCounts: realCounts,
//       backgroundColor: LABELS_16_POINT.map(() => bin.color),
//       borderColor: LABELS_16_POINT.map(() => '#ffffff'),
//       borderWidth: 1,
//     };
//   });

//   const maxStacked = Math.max(
//     ...LABELS_16_POINT.map((dir) =>
//       SPEED_BINS.reduce((sum, bin) => sum + pctMap[dir][bin.label], 0)
//     )
//   );

//   return {
//     chartData: {
//       labels: LABELS_16_POINT,
//       datasets: datasets,
//     },
//     pctMap,
//     countsMap,
//     maxStacked,
//   };
// };

// const WindRadarChart = ({
//   windSpeedData,
//   windDirectionData,
//   loading,
// }: {
//   windSpeedData: WindData[];
//   windDirectionData: WindData[];
//   loading: boolean;
// }) => {

//   const chartRef = useRef<HTMLDivElement>(null);

//   const textColor = useColorModeValue('gray.800', 'gray.200');

//   const axisLineColor = useColorModeValue(
//     'rgba(0,0,0,0.3)',
//     'rgba(255,255,255,0.3)'
//   );

//   const backdropColor = useColorModeValue(
//     'rgba(255,255,255,0.85)',
//     'rgba(26,32,44,0.85)'
//   );

//   const { chartData, pctMap, countsMap, maxStacked } =
//     prepareWindRoseData(windSpeedData, windDirectionData);

//   const isDataEmpty = !chartData || chartData.datasets.length === 0;

//   const chartOptions: ChartOptions<'polarArea'> = {

//     responsive: true,
//     maintainAspectRatio: false,

//     scales: {
//       r: {

//         min: 0,
//         suggestedMax: Math.max(6, Math.ceil(maxStacked + 1)),

//         angleLines: {
//           display: true,
//           color: axisLineColor,
//           lineWidth: 0.4,
//         },

//         grid: {
//           circular: true,
//           color: (context) => {

//             const value = context.tick.value;

//             if (value < 2) return '#7cb5ec';
//             if (value < 4) return '#434348';
//             if (value < 6) return '#90ed7d';
//             if (value < 8) return '#f7a35c';

//             return '#8085e9';
//           },
//         },

//         ticks: {
//           stepSize: 2,
//           display: true,
//           color: 'black',
//           backdropColor: backdropColor,
//           backdropPadding: 3,
//           z: 10,

//           callback: (value: any) => {
//             if (value === 0) return '';
//             return `${value}%`;
//           },
//         },

//         pointLabels: {
//           display: true,
//           color: textColor,
//           font: { size: 12 },
//         },
//       },
//     },

//     plugins: {

//       legend: {
//         display: true,
//         position: 'right',
//         onClick: () => {},
//         labels: {
//           color: textColor,
//           usePointStyle: true,
//           padding: 20,

//           generateLabels: (chart: any) => {

//             const datasets = chart.data.datasets;

//             return datasets.map((dataset: any, i: number) => ({
//               text: dataset.label,
//               fillStyle: dataset.backgroundColor[0],
//               strokeStyle: dataset.borderColor[0],
//               lineWidth: dataset.borderWidth,
//               hidden: false,
//               datasetIndex: i,
//             }));
//           },
//         },
//       },

//       tooltip: {
//         callbacks: {

//           label: (context: any) => {

//             const dataset = context.dataset;

//             const realValue = dataset.realData[context.dataIndex];
//             const countValue = dataset.realCounts[context.dataIndex];

//             if (realValue === 0) return undefined;

//             return ` ${dataset.label}: ${realValue.toFixed(1)}% (${countValue} mesures)`;
//           },
//         },
//       },
//     },
//   };

//   const handleScreenshot = async () => {

//     if (!chartRef.current) return;

//     const canvas = await html2canvas(chartRef.current, {
//       scale: 2,
//       backgroundColor: null,
//     });

//     const link = document.createElement('a');

//     link.download = 'wind_direction_chart.png';
//     link.href = canvas.toDataURL();
//     link.click();
//   };

//   const handleDownloadData = () => {

//     if (isDataEmpty) return;

//     const headers = [
//       'Direction',
//       ...SPEED_BINS.map((b) => `${b.label} (%)`),
//       ...SPEED_BINS.map((b) => `${b.label} (Count)`),
//     ];

//     const rows = LABELS_16_POINT.map((dir) => {

//       const pctData = SPEED_BINS.map(
//         (bin) => pctMap[dir][bin.label].toFixed(2) + '%'
//       );

//       const countData = SPEED_BINS.map(
//         (bin) => countsMap[dir][bin.label].toString()
//       );

//       return [dir, ...pctData, ...countData].join(',');
//     });

//     const csv = headers.join(',') + '\n' + rows.join('\n');

//     const blob = new Blob([csv], { type: 'text/csv' });

//     const url = URL.createObjectURL(blob);

//     const link = document.createElement('a');

//     link.href = url;
//     link.download = 'wind_direction_data.csv';
//     link.click();

//     URL.revokeObjectURL(url);
//   };

//   return (

//     <Box width="100%" pr={4} pb={4}>

//       <Flex justify="space-between" align="center" mb={4}>

//         <Text fontSize="xl" fontWeight="bold" color={textColor}>
//           Direction de vent
//         </Text>

//         <HStack spacing={2}>

//           <Button
//             aria-label="Capture"
//             colorScheme="teal"
//             variant="ghost"
//             onClick={handleScreenshot}
//           >
//             <FaCamera />
//           </Button>

//           <Button
//             aria-label="Export"
//             colorScheme="blue"
//             variant="ghost"
//             onClick={handleDownloadData}
//             isDisabled={isDataEmpty}
//           >
//             <FaDownload />
//           </Button>

//         </HStack>
//       </Flex>

//       <ChartStateView
//         loading={loading}
//         empty={isDataEmpty}
//         emptyText="Aucune donnée disponible"
//         chartRef={chartRef}
//         height="400px"
//       >
//         <PolarArea data={chartData as any} options={chartOptions} />
//       </ChartStateView>

//     </Box>
//   );
// };

// export default WindRadarChart;