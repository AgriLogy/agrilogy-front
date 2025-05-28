import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import TempuratureHumidtyChart from "./TempuratureHumidtyChart";
import TempuratureHumidtyLastData from "./TempuratureHumidtyLastData";

interface WeatherData {
  id: number;
  timestamp: string;
  default_unit: string;
  available_units: string[];
  value: number;
  zone: number;
  user: number;
}

const TempuratureHumidtyMain = ({
  filters,
}: {
  filters: {
    startDate: string;
    endDate: string;
    selectedZone: number | null;
  };
}) => {
  const { startDate, endDate, selectedZone } = filters;
  const [humidityData, setHumidityData] = useState<WeatherData[]>([]);
  const [temperatureData, setTemperatureData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHumidity = api.get<WeatherData[]>(
      "/api/sensors/humidityweather/",
      {
        params: {
          start_date: startDate,
          end_date: endDate,
          zone: selectedZone,
        },
      }
    );

    const fetchTemperature = api.get<WeatherData[]>(
      "/api/sensors/temperatureweather/",
      {
        params: {
          start_date: startDate,
          end_date: endDate,
          zone: selectedZone,
        },
      }
    );

    Promise.all([fetchHumidity, fetchTemperature])
      .then(([humRes, tempRes]) => {
        setHumidityData(humRes.data);
        setTemperatureData(tempRes.data);
      })
      .catch((err) => console.error("Error fetching weather data:", err))
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
        <TempuratureHumidtyLastData
          humidityData={humidityData}
          temperatureData={temperatureData}
        />
      </Box>
      <Box flex={3} p={2} height="100%" width="100%">
        <TempuratureHumidtyChart
          humidityData={humidityData}
          temperatureData={temperatureData}
          loading={loading}
        />
      </Box>
    </Stack>
  );
};

export default TempuratureHumidtyMain;