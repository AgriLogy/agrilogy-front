import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import WindRadarLastData from "./WindRadarLastData";
import WindRadarChart from "./WindRadarChart";

interface WindData {
  id: number;
  timestamp: string;
  default_unit: string;
  available_units: string[];
  value: number;
  zone: number;
  user: number;
}

const WindRadarMain = ({
  filters,
}: {
  filters: {
    startDate: string;
    endDate: string;
    selectedZone: number | null;
  };
}) => {
  const { startDate, endDate, selectedZone } = filters;
  const [speedData, setSpeedData] = useState<WindData[]>([]);
  const [directionData, setDirectionData] = useState<WindData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeed = api.get<WindData[]>("/api/sensors/windspeed/", {
      params: {
        start_date: startDate,
        end_date: endDate,
        zone: selectedZone,
      },
    });

    const fetchDirection = api.get<WindData[]>("/api/sensors/winddirection/", {
      params: {
        start_date: startDate,
        end_date: endDate,
        zone: selectedZone,
      },
    });

    Promise.all([fetchSpeed, fetchDirection])
      .then(([speedRes, dirRes]) => {
        setSpeedData(speedRes.data);
        setDirectionData(dirRes.data);
      })
      .catch((err) => console.error("Error fetching wind data:", err))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedZone]);

  return (
    <Stack
      spacing={2}
      direction={{ base: "column", md: "row" }}
      align="start"
      width="100%"
      height="100%"
      className="Box"
    >
      <Box flex={1} p={3} height="100%" width="100%">
        <WindRadarLastData
          windSpeedData={speedData}
          windDirectionData={directionData}
        />
      </Box>
      <Box flex={3} p={2} height="100%" width="100%">
        <WindRadarChart
          windSpeedData={speedData}
          windDirectionData={directionData}
          loading={loading}
        />
      </Box>
    </Stack>
  );
};

export default WindRadarMain;
