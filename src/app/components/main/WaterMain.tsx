'use client';

import { Box, Stack } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

import ZoneNotificationBell from '@/app/components/common/ZoneNotificationBell';
import { ChartFrequencyProvider } from '@/app/components/common/ChartFrequencyContext';
import { ChartDateRangeControl } from '@/app/components/layout/ChartDateRangeControl';
import { ChartFrequencyControl } from '@/app/components/layout/ChartFrequencyControl';
import { ChartSection } from '@/app/components/layout/ChartSection';
import { PageInfoBar } from '@/app/components/layout/PageInfoBar';
import { ZoneSelect } from '@/app/components/layout/ZoneSelect';
import { pageSubtitle } from '@/app/components/layout/pageSubtitle';
import { useAnalyticsHeader } from '@/app/components/layout/useAnalyticsHeader';

import CumulPrecipitationMain from '../analytics/CumulPrecipitation/CumulPrecipitationMain';
import EcWaterMain from '../analytics/WaterEc/EcWaterMain';
import ForageMain from '../analytics/Forage/ForageMain';
import WaterFlowMain from '../analytics/WaterFlow/WaterFlowMain';
import PhWaterMain from '../analytics/WaterPh/PhWaterMain';
import WaterLevelMain from '../analytics/WaterLevel/WaterLevelMain';
import WaterPressureMain from '../analytics/WaterPressure/WaterPressureMain';

const WaterMain = () => {
  const t = useTranslations();
  const {
    zones,
    selectedZone,
    setSelectedZone,
    zoneName,
    range,
    setRange,
    frequency,
    setFrequency,
    activeGraph,
    filters,
  } = useAnalyticsHeader();

  // Basin / borehole sections show for zones carrying that geometry
  // (same gating as the station page used to apply).
  const currentZone = zones.find((z) => z.id === selectedZone);
  const hasBasin =
    currentZone?.basin_max_depth_m != null ||
    currentZone?.basin_area_m2 != null ||
    currentZone?.basin_length_m != null ||
    currentZone?.basin_width_m != null ||
    currentZone?.basin_height_m != null;
  const hasForage =
    currentZone?.forage_diameter_m != null ||
    currentZone?.forage_total_depth_m != null ||
    currentZone?.forage_high_m != null ||
    currentZone?.forage_low_m != null;

  return (
    <Box px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }}>
      <PageInfoBar
        title={t('shell.water.title')}
        subtitle={pageSubtitle({
          zoneName,
          startDate: range.startDate,
          endDate: range.endDate,
          t,
        })}
        zoneControl={
          <ZoneSelect
            zones={zones}
            value={selectedZone}
            onChange={setSelectedZone}
          />
        }
        dateRange={<ChartDateRangeControl value={range} onChange={setRange} />}
        frequencyControl={
          <ChartFrequencyControl value={frequency} onChange={setFrequency} />
        }
        actions={
          selectedZone != null ? (
            <ZoneNotificationBell
              zoneId={selectedZone}
              zoneName={zoneName ?? t('shell.water.zoneFallback')}
            />
          ) : null
        }
      />

      <ChartFrequencyProvider value={frequency}>
        <Stack spacing={{ base: 3, md: 4 }} minW={0}>
          {activeGraph?.water_flow_status && (
            <ChartSection>
              <WaterFlowMain filters={filters} />
            </ChartSection>
          )}
          {activeGraph?.water_pressure_status && (
            <ChartSection>
              <WaterPressureMain filters={filters} />
            </ChartSection>
          )}
          {activeGraph?.water_ph_status && (
            <ChartSection>
              <PhWaterMain filters={filters} />
            </ChartSection>
          )}
          {activeGraph?.water_ec_status && (
            <ChartSection>
              <EcWaterMain filters={filters} />
            </ChartSection>
          )}
          {activeGraph?.cumulative_precipitation_status && (
            <ChartSection>
              <CumulPrecipitationMain filters={filters} />
            </ChartSection>
          )}
          {hasBasin && (
            <ChartSection>
              <WaterLevelMain
                filters={filters}
                basin={{
                  lengthM: currentZone?.basin_length_m,
                  widthM: currentZone?.basin_width_m,
                  heightM: currentZone?.basin_height_m,
                  sensorToMaxM: currentZone?.sensor_mount_offset_m,
                  maxDepthM: currentZone?.basin_max_depth_m,
                  areaM2: currentZone?.basin_area_m2,
                  offsetM: currentZone?.sensor_mount_offset_m,
                }}
              />
            </ChartSection>
          )}
          {hasForage && (
            <ChartSection>
              <ForageMain
                filters={filters}
                forage={{
                  diameterM: currentZone?.forage_diameter_m,
                  totalDepthM: currentZone?.forage_total_depth_m,
                  highM: currentZone?.forage_high_m,
                  lowM: currentZone?.forage_low_m,
                }}
              />
            </ChartSection>
          )}
        </Stack>
      </ChartFrequencyProvider>
    </Box>
  );
};

export default WaterMain;
