import { Box, Button, HStack, VStack } from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FaPause, FaPlay } from 'react-icons/fa';
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

/** One animation frame every 150 ms (~8 points/s). */
const PLAY_TICK_MS = 150;

const mergeGeom = (
  zone: ForageGeometry,
  local: ForageGeometry | null
): ForageGeometry => ({
  diameterM: zone.diameterM ?? local?.diameterM ?? null,
  totalDepthM: zone.totalDepthM ?? local?.totalDepthM ?? null,
  highM: zone.highM ?? local?.highM ?? null,
  lowM: zone.lowM ?? local?.lowM ?? null,
});

/**
 * Play/pause sweep of the playhead through the visible window. The cylinder
 * + side panel follow the playhead, so the water level animates over time.
 */
const PlayControls = ({
  startIdx,
  endIdx,
  total,
  playIdx,
  onPlayIdx,
  stopSignal,
}: {
  startIdx: number;
  endIdx: number;
  total: number;
  playIdx: number | null;
  onPlayIdx: (next: number | null) => void;
  /** Changing this stops playback (zone / dates changed). */
  stopSignal: string;
}) => {
  const t = useTranslations();
  const [playing, setPlaying] = useState(false);
  const playIdxRef = useRef<number | null>(null);
  useEffect(() => {
    playIdxRef.current = playIdx;
  });

  useEffect(() => {
    setPlaying(false);
  }, [startIdx, endIdx, stopSignal]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const cur = playIdxRef.current;
      const next =
        cur == null || cur < startIdx || cur >= endIdx ? startIdx : cur + 1;
      onPlayIdx(next);
      if (next >= endIdx) setPlaying(false);
    }, PLAY_TICK_MS);
    return () => clearInterval(id);
  }, [playing, startIdx, endIdx, onPlayIdx]);

  if (total === 0) return null;
  return (
    <HStack spacing={2}>
      <Button
        size="sm"
        variant="outline"
        leftIcon={playing ? <FaPause /> : <FaPlay />}
        onClick={() => {
          if (playing) {
            setPlaying(false);
            return;
          }
          const cur = playIdxRef.current;
          if (cur == null || cur < startIdx || cur >= endIdx) {
            onPlayIdx(startIdx);
          }
          setPlaying(true);
        }}
      >
        {playing ? t('analytics.forage.pause') : t('analytics.forage.play')}
      </Button>
    </HStack>
  );
};

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
  /** Playhead index into the full series (null = latest reading). */
  const [playIdx, setPlayIdx] = useState<number | null>(null);

  useEffect(() => {
    setOverride(readForageOverride(selectedZone));
  }, [selectedZone]);

  useEffect(() => {
    setPlayIdx(null);
  }, [selectedZone, startDate, endDate]);

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
            {({ startIdx, endIdx, setRange }) => {
              const slice = sortedData.slice(startIdx, endIdx + 1);
              const playRow =
                playIdx != null && playIdx >= startIdx && playIdx <= endIdx
                  ? sortedData[playIdx]
                  : null;
              return (
                <VStack spacing={2} align="stretch" width="100%">
                  <ForageChart
                    data={slice}
                    loading={loading}
                    highM={resolved.highM}
                    lowM={resolved.lowM}
                    playTimestamp={playRow?.timestamp ?? null}
                  />
                  <ChartDateRangeDragger
                    timestamps={timeline}
                    startIdx={startIdx}
                    endIdx={endIdx}
                    onChange={(r) => {
                      setRange(r);
                      setPlayIdx(null);
                    }}
                  />
                  <PlayControls
                    startIdx={startIdx}
                    endIdx={endIdx}
                    total={sortedData.length}
                    playIdx={playIdx}
                    onPlayIdx={setPlayIdx}
                    stopSignal={`${selectedZone}|${startDate}|${endDate}`}
                  />
                  <ForageConfigForm
                    zoneId={selectedZone}
                    initial={geom}
                    onChange={setOverride}
                  />
                </VStack>
              );
            }}
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
          <ForageLastData
            data={data}
            rows={sortedData}
            activeIndex={playIdx}
            forage={geom}
          />
        </Box>
      }
    />
  );
};

export default ForageMain;
