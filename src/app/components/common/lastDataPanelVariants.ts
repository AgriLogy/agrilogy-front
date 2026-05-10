/**
 * Per-feature tinted panels for "latest reading" blocks.
 *
 * Earlier versions of this file used a different hue per sensor type
 * (blue for water, cyan for VPD, indigo for flow, etc.) which leaked
 * blues across the whole UI. We now centralise on a single brand-green
 * tint for every variant — the icon inside each card is enough to
 * differentiate the sensor type, and a consistent surface keeps the
 * dashboard on one palette.
 *
 * Light mode  — brand-100 surface, brand-300 left accent.
 * Dark mode   — brand-700 @ ~20% (rgba) surface, brand-400 accent.
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

const brandVariant = {
  bgLight: 'brand.50',
  /* primary[700] = #175e33 at 22 % opacity */
  bgDark: 'rgba(23, 94, 51, 0.22)',
  borderLightTok: 'brand.300',
  borderDarkTok: 'brand.400',
} as const;

export const LAST_DATA_VARIANT_STYLES: Record<
  LastDataPanelVariant,
  {
    bgLight: string;
    bgDark: string;
    borderLightTok: string;
    borderDarkTok: string;
  }
> = {
  waterSoil: brandVariant,
  vpd: brandVariant,
  windRadar: brandVariant,
  windSpeed: brandVariant,
  npk: brandVariant,
  fruiteSize: brandVariant,
  tempHumidity: brandVariant,
  waterPressure: brandVariant,
  phWater: brandVariant,
  waterFlow: brandVariant,
  ecWater: brandVariant,
  solarRadiation: brandVariant,
  et0: brandVariant,
  cumulPrecipitation: brandVariant,
  precipitationRate: brandVariant,
  largeFruitDiameter: brandVariant,
  electricity: brandVariant,
  phSoil: brandVariant,
  soilSalinity: brandVariant,
  soilTemperature: brandVariant,
  soilConductivity: brandVariant,
  sensorLeaf: brandVariant,
};
