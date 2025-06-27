import { useEffect, useState } from "react";
import { Stack, Box } from "@chakra-ui/react";
import api from "@/app/lib/api";
import WaterSoilChart from "./WaterSoilChart";
import WaterSoilLastData from "./WaterSoilLastData";

interface SensorEntry {
  id: number;
  timestamp: string;
  value: number;
  default_unit: string;
  available_units: string[];
  zone: number;
  user: number;
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

  // NEW: States for last sensor values
  const [soilLowLast, setSoilLowLast] = useState<SensorEntry | undefined>();
  const [soilMediumLast, setSoilMediumLast] = useState<
    SensorEntry | undefined
  >();
  const [soilHighLast, setSoilHighLast] = useState<SensorEntry | undefined>();
  const [waterFlowLast, setWaterFlowLast] = useState<SensorEntry | undefined>();

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

        // SET LAST VALUES
        setSoilLowLast(lowRes.data.at(-1));
        setSoilMediumLast(medRes.data.at(-1));
        setSoilHighLast(highRes.data.at(-1));
        setWaterFlowLast(waterRes.data.at(-1));
      })
      .catch((err) => console.error("Failed to fetch sensor data:", err))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedZone]);

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      width="100%"
      height="100%"
      spacing={4}
    >
      <Box flex={3} p={3}>
        {!loading && <WaterSoilChart data={mergedData} />}
      </Box>
      <Box flex={1} p={3}>
        <WaterSoilLastData
          soilLow={soilLowLast}
          soilMedium={soilMediumLast}
          soilHigh={soilHighLast}
          waterFlow={waterFlowLast}
        />
      </Box>
    </Stack>
  );
};

export default WaterSoilMain;
