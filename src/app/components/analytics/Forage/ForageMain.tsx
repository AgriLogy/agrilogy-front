import { Box, VStack } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import ChartDateRangeDragger from '../../common/ChartDateRangeDragger';
import ChartLastDataShell from '../../common/ChartLastDataShell';
import ChartDateRangeGate from '../../common/ChartDateRangeGate';
import { useFrequencySeries } from '../../common/ChartFrequencyContext';
import { SensorData } from '@/app/types';
import api from '@/app/lib/api';
import { logOptionalApiFailure } from '@/app/utils/apiClientErrors';
import {
  depthToForagePoint,
  rawToMetres,
  resolveForage,
  type ForageGeometry,
} from '@/app/utils/forageLevel';
import ForageChart, { type ForageChartRow } from './ForageChart';
import ForageLastData from './ForageLastData';
import ForageConfigForm, { readForageOverride } from './ForageConfigForm';
import { CHART_SHELL_MAX_HEIGHT } from '@/app/utils/chartAxisConfig';

const mergeGeom = (
  zone: ForageGeometry,
  local: ForageGeometry | null
): ForageGeometry => ({
  diameterM: zone.diameterM ?? local?.diameterM ?? null,
  totalDepthM: zone.totalDepthM ?? local?.totalDepthM ?? null,
  highM: zone.highM ?? local?.highM ?? null,
  lowM: zone.lowM ?? local?.lowM ?? null,
});

const ForageMain = ({
  filters,
  forage,
}: {
  filters: {
    startDate: string;
    endDate: string;
    selectedZone: number | null;
  };
  forage: ForageGeometry;
}) => {
  const { startDate, endDate, selectedZone } = filters;
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [override, setOverride] = useState<ForageGeometry | null>(null);

  useEffect(() => {
    setOverride(readForageOverride(selectedZone));
  }, [selectedZone]);

  useEffect(() => {
    const params = {
      start_date: startDate,
      end_date: endDate,
      zone: selectedZone,
    };
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get<SensorData[]>('/sensors/forage', {
          params,
        });
        if (cancelled) return;
        setData(res.data ?? []);
      } catch (error) {
        logOptionalApiFailure('ForageMain: forage', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [startDate, endDate, selectedZone]);

  const geom = useMemo(() => mergeGeom(forage, override), [forage, override]);
  const resolved = useMemo(() => resolveForage(geom), [geom]);

  // Raw D(t) = depth, displayed as-is (no volume computation).
  const depthRows: ForageChartRow[] = useMemo(
    () =>
      data.flatMap((item) => {
        if (typeof item.value !== 'number') return [];
        const dM = rawToMetres(item.value, item.default_unit);
        const p = depthToForagePoint(dM, resolved);
        if (!p) return [];
        return [
          {
            timestamp: item.timestamp,
            depthM: p.depthM,
          },
        ];
      }),
    [data, resolved]
  );

  const { series: sortedData, timeline } = useFrequencySeries(depthRows);

  return (
    <ChartLastDataShell
      spacing={2}
      direction={{ base: 'column', md: 'row' }}
      align="start"
      width="100%"
      className="Box"
      maxH={CHART_SHELL_MAX_HEIGHT}
      chart={
        <Box flex={3} p={2} width="100%" minW={0}>
          <ChartDateRangeGate timeline={timeline}>
            {({ startIdx, endIdx, setRange }) => (
              <VStack spacing={2} align="stretch" width="100%">
                <ForageChart
                  data={sortedData.slice(startIdx, endIdx + 1)}
                  loading={loading}
                  highM={resolved.highM}
                  lowM={resolved.lowM}
                />
                <ChartDateRangeDragger
                  timestamps={timeline}
                  startIdx={startIdx}
                  endIdx={endIdx}
                  onChange={(r) => setRange(r)}
                />
                <ForageConfigForm
                  zoneId={selectedZone}
                  initial={geom}
                  onChange={setOverride}
                />
              </VStack>
            )}
          </ChartDateRangeGate>
        </Box>
      }
      lastData={
        <Box
          flex={1}
          p={3}
          width="100%"
          minW={0}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="stretch"
        >
          <ForageLastData data={data} forage={geom} />
        </Box>
      }
    />
  );
};

export default ForageMain;
