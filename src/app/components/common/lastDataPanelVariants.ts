/**
 * Per-feature tinted panels for “latest reading” blocks (light = Chakra token, dark = CSS for consistent hue).
 */
export type LastDataPanelVariant =
  | 'waterSoil'
  | 'vpd'
  | 'windRadar'
  | 'windSpeed'
  | 'npk'
  | 'fruiteSize'
  | 'tempHumidity'
  | 'waterPressure'
  | 'phWater'
  | 'waterFlow'
  | 'ecWater'
  | 'solarRadiation'
  | 'et0'
  | 'cumulPrecipitation'
  | 'precipitationRate'
  | 'largeFruitDiameter'
  | 'electricity'
  | 'phSoil'
  | 'soilSalinity'
  | 'soilTemperature'
  | 'soilConductivity'
  | 'sensorLeaf';

export const LAST_DATA_VARIANT_STYLES: Record<
  LastDataPanelVariant,
  {
    bgLight: string;
    bgDark: string;
    borderLightTok: string;
    borderDarkTok: string;
  }
> = {
  waterSoil: {
    bgLight: 'blue.50',
    bgDark: 'rgba(37, 99, 235, 0.2)',
    borderLightTok: 'blue.200',
    borderDarkTok: 'blue.400',
  },
  vpd: {
    bgLight: 'green.50',
    bgDark: 'rgba(22, 101, 52, 0.22)',
    borderLightTok: 'green.200',
    borderDarkTok: 'green.400',
  },
  windRadar: {
    bgLight: 'cyan.50',
    bgDark: 'rgba(14, 116, 144, 0.2)',
    borderLightTok: 'cyan.200',
    borderDarkTok: 'cyan.400',
  },
  windSpeed: {
    bgLight: 'teal.50',
    bgDark: 'rgba(15, 118, 110, 0.2)',
    borderLightTok: 'teal.200',
    borderDarkTok: 'teal.400',
  },
  npk: {
    bgLight: 'orange.50',
    bgDark: 'rgba(194, 65, 12, 0.2)',
    borderLightTok: 'orange.200',
    borderDarkTok: 'orange.400',
  },
  fruiteSize: {
    bgLight: 'pink.50',
    bgDark: 'rgba(157, 23, 77, 0.22)',
    borderLightTok: 'pink.200',
    borderDarkTok: 'pink.400',
  },
  tempHumidity: {
    bgLight: 'purple.50',
    bgDark: 'rgba(107, 33, 168, 0.2)',
    borderLightTok: 'purple.200',
    borderDarkTok: 'purple.400',
  },
  waterPressure: {
    bgLight: 'blue.50',
    bgDark: 'rgba(29, 78, 216, 0.2)',
    borderLightTok: 'blue.300',
    borderDarkTok: 'blue.500',
  },
  phWater: {
    bgLight: 'cyan.50',
    bgDark: 'rgba(8, 145, 178, 0.2)',
    borderLightTok: 'cyan.300',
    borderDarkTok: 'cyan.500',
  },
  waterFlow: {
    bgLight: 'indigo.50',
    bgDark: 'rgba(67, 56, 202, 0.2)',
    borderLightTok: 'indigo.200',
    borderDarkTok: 'indigo.400',
  },
  ecWater: {
    bgLight: 'yellow.50',
    bgDark: 'rgba(161, 98, 7, 0.22)',
    borderLightTok: 'yellow.300',
    borderDarkTok: 'yellow.500',
  },
  solarRadiation: {
    bgLight: 'yellow.50',
    bgDark: 'rgba(202, 138, 4, 0.2)',
    borderLightTok: 'yellow.200',
    borderDarkTok: 'yellow.400',
  },
  et0: {
    bgLight: 'orange.50',
    bgDark: 'rgba(234, 88, 12, 0.2)',
    borderLightTok: 'orange.200',
    borderDarkTok: 'orange.400',
  },
  cumulPrecipitation: {
    bgLight: 'blue.50',
    bgDark: 'rgba(30, 64, 175, 0.22)',
    borderLightTok: 'blue.200',
    borderDarkTok: 'blue.500',
  },
  precipitationRate: {
    bgLight: 'cyan.50',
    bgDark: 'rgba(8, 145, 178, 0.18)',
    borderLightTok: 'cyan.300',
    borderDarkTok: 'cyan.600',
  },
  largeFruitDiameter: {
    bgLight: 'purple.50',
    bgDark: 'rgba(91, 33, 182, 0.2)',
    borderLightTok: 'purple.200',
    borderDarkTok: 'purple.400',
  },
  electricity: {
    bgLight: 'gray.100',
    bgDark: 'rgba(148, 163, 184, 0.18)',
    borderLightTok: 'gray.300',
    borderDarkTok: 'gray.500',
  },
  phSoil: {
    bgLight: 'green.100',
    bgDark: 'rgba(63, 98, 18, 0.22)',
    borderLightTok: 'green.300',
    borderDarkTok: 'green.500',
  },
  soilSalinity: {
    bgLight: 'gray.50',
    bgDark: 'rgba(71, 85, 105, 0.25)',
    borderLightTok: 'slate.300',
    borderDarkTok: 'slate.500',
  },
  soilTemperature: {
    bgLight: 'red.50',
    bgDark: 'rgba(185, 28, 28, 0.2)',
    borderLightTok: 'red.200',
    borderDarkTok: 'red.400',
  },
  soilConductivity: {
    bgLight: 'teal.50',
    bgDark: 'rgba(13, 148, 136, 0.22)',
    borderLightTok: 'teal.200',
    borderDarkTok: 'teal.400',
  },
  sensorLeaf: {
    bgLight: 'green.50',
    bgDark: 'rgba(21, 128, 61, 0.22)',
    borderLightTok: 'green.200',
    borderDarkTok: 'green.500',
  },
};
