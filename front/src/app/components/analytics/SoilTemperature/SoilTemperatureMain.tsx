"use client";

import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { SensorData } from "@/app/types";
import SoilTemperatureChart from "./SoilTemperatureChart";
import SoilTemperatureLastData from "./SoilTemperatureLastData";

export type TemperaturePoint = {
  timestamp: string;
  low?: number;
  medium?: number;
  high?: number;
};

const SoilTemperatureMain = ({
  filters,
}: {
  filters: { startDate: string; endDate: string; selectedZone: number | null };
}) => {
  const { startDate, endDate, selectedZone } = filters;

  const [data, setData] = useState<TemperaturePoint[]>([]);
  const [loading, setLoading] = useState(true);

  // last items per depth
  const [lastLow, setLastLow] = useState<SensorData | undefined>();
  const [lastMedium, setLastMedium] = useState<SensorData | undefined>();
  const [lastHigh, setLastHigh] = useState<SensorData | undefined>();

  useEffect(() => {
    setLoading(true);

    const fetchSeries = (endpoint: string) =>
      api.get<SensorData[]>(endpoint, {
        params: {
          start_date: startDate,
          end_date: endDate,
          zone: selectedZone,
        },
      });

    Promise.all([
      fetchSeries("/api/sensors/soiltemperaturelow/"),
      fetchSeries("/api/sensors/soiltemperaturemedium/"),
      fetchSeries("/api/sensors/soiltemperaturehigh/"),
    ])
      .then(([lowRes, medRes, highRes]) => {
        const map = new Map<string, TemperaturePoint>();

        lowRes.data.forEach((d) => {
          if (!map.has(d.timestamp))
            map.set(d.timestamp, { timestamp: d.timestamp });
          map.get(d.timestamp)!.low = d.value;
        });

        medRes.data.forEach((d) => {
          if (!map.has(d.timestamp))
            map.set(d.timestamp, { timestamp: d.timestamp });
          map.get(d.timestamp)!.medium = d.value;
        });

        highRes.data.forEach((d) => {
          if (!map.has(d.timestamp))
            map.set(d.timestamp, { timestamp: d.timestamp });
          map.get(d.timestamp)!.high = d.value;
        });

        const merged = Array.from(map.values()).sort((a, b) =>
          a.timestamp.localeCompare(b.timestamp)
        );
        setData(merged);

        setLastLow(lowRes.data.at(-1));
        setLastMedium(medRes.data.at(-1));
        setLastHigh(highRes.data.at(-1));
      })
      .catch((err) => console.error("Failed to fetch soil temperature:", err))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedZone]);

  return (
    <Stack
      spacing={2}
      direction={{ base: "column", md: "row" }}
      align="start"
      width="100%"
      height="100%"
    >
      <Box flex={3} p={2} height="100%" width="100%">
        <SoilTemperatureChart
          data={data}
          loading={loading}
          bestValueMin={12} // °C
          bestValueMax={250} // °C
        />
      </Box>

      <Box flex={1} p={3} height="100%" width="100%">
        <SoilTemperatureLastData
          lastLow={lastLow}
          lastMedium={lastMedium}
          lastHigh={lastHigh}
        />
      </Box>
    </Stack>
  );
};

export default SoilTemperatureMain;
