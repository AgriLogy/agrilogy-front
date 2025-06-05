import { useEffect, useState } from "react";
import { Stack, Box } from "@chakra-ui/react";
import api from "@/app/lib/api";
import WaterSoilChart from "./WaterSoilChart";

interface SensorEntry {
  timestamp: string;
  value: number;
}

export interface WaterSoilData {
  timestamp: string;
  soilLow?: number;
  soilMedium?: number;
  soilHigh?: number;
  waterFlow?: number;
}

const WaterSoilMain = ({
  filters,
}: {
  filters: {
    startDate: string;
    endDate: string;
    selectedZone: number | null;
  };
}) => {
  const { startDate, endDate, selectedZone } = filters;
  const [mergedData, setMergedData] = useState<WaterSoilData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSensor = (endpoint: string) =>
      api.get<SensorEntry[]>(endpoint, {
        params: {
          start_date: startDate,
          end_date: endDate,
          zone: selectedZone,
        },
      });

    Promise.all([
      fetchSensor("/api/sensors/soilmoisturelow"),
      fetchSensor("/api/sensors/soilmoisturemedium"),
      fetchSensor("/api/sensors/soilmoisturehigh"),
      fetchSensor("/api/sensors/waterflow"),
    ])
      .then(([lowRes, medRes, highRes, waterRes]) => {
        const map = new Map<string, WaterSoilData>();

        lowRes.data.forEach((item) => {
          if (!map.has(item.timestamp))
            map.set(item.timestamp, { timestamp: item.timestamp });
          map.get(item.timestamp)!.soilLow = item.value;
        });

        medRes.data.forEach((item) => {
          if (!map.has(item.timestamp))
            map.set(item.timestamp, { timestamp: item.timestamp });
          map.get(item.timestamp)!.soilMedium = item.value;
        });

        highRes.data.forEach((item) => {
          if (!map.has(item.timestamp))
            map.set(item.timestamp, { timestamp: item.timestamp });
          map.get(item.timestamp)!.soilHigh = item.value;
        });

        waterRes.data.forEach((item) => {
          if (!map.has(item.timestamp))
            map.set(item.timestamp, { timestamp: item.timestamp });
          map.get(item.timestamp)!.waterFlow = item.value;
        });

        const sorted = Array.from(map.values()).sort((a, b) =>
          a.timestamp.localeCompare(b.timestamp)
        );
        setMergedData(sorted);
        console.log(waterRes);
      })
      .catch((err) => console.error("Failed to fetch sensor data:", err))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedZone]);

  return (
    <Stack width="100%" height="100%">
      <Box flex={1} p={3} height="100%">
        {!loading && <WaterSoilChart data={mergedData} />}
      </Box>
    </Stack>
  );
};

export default WaterSoilMain;
