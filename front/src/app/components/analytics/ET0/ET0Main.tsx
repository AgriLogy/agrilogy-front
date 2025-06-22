import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import ET0LastData from "./ET0LastData";
import ET0Chart from "./ET0Chart";

interface ET0Data {
  id: number;
  timestamp: string;
  default_unit: string;
  available_units: string[];
  value: number;
  zone: number;
  user: number;
}

const ET0Main = ({
  filters,
}: {
  filters: {
    startDate: string;
    endDate: string;
    selectedZone: number | null;
  };
}) => {
  const { startDate, endDate, selectedZone } = filters;

  const [weatherData, setWeatherData] = useState<ET0Data[]>([]);
  const [calculatedData, setCalculatedData] = useState<ET0Data[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {
      start_date: startDate,
      end_date: endDate,
      zone: selectedZone ?? undefined,
    };

    const fetchWeather = api.get<ET0Data[]>("/api/sensors/et0weather/", { params });
    const fetchCalculated = api.get<ET0Data[]>("/api/sensors/et0calculated/", { params });

    Promise.all([fetchWeather, fetchCalculated])
      .then(([weatherRes, calculatedRes]) => {
        setWeatherData(weatherRes.data);
        setCalculatedData(calculatedRes.data);
      })
      .catch((err) => {
        console.error("Failed to fetch ET0 sensor data:", err);
      })
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
      <Box flex={3} p={2} height="100%" width="100%">
        <ET0Chart
          weatherData={weatherData}
          calculatedData={calculatedData}
          loading={loading}
        />
      </Box>
      <Box flex={1} p={3} height="100%" width="100%">
        <ET0LastData weatherData={weatherData} calculatedData={calculatedData} />
      </Box>
    </Stack>
  );
};

export default ET0Main;
