import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  VStack,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiStrongWind,
  WiHumidity,
  WiThermometer,
} from "react-icons/wi";

const WEATHER_API =
  "https://api.open-meteo.com/v1/forecast?latitude=32.906323&longitude=-6.934420&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto";

const getWeatherIcon = (code: number) => {
  if ([0, 1].includes(code)) return <WiDaySunny size={28} />;
  if ([2, 3].includes(code)) return <WiCloud size={28} />;
  if ([61, 63, 65].includes(code)) return <WiRain size={28} />;
  if ([71, 73, 75].includes(code)) return <WiSnow size={28} />;
  return <WiCloud size={28} />;
};

const WeatherDashboard = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const bg = useColorModeValue("whiteAlpha.500", "whiteAlpha.100");

  useEffect(() => {
    fetch(WEATHER_API)
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (!weather) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Text>Error loading weather data.</Text>
      </Flex>
    );
  }

  const { current, daily } = weather;

  return (
    <Box w="100%" p={4} bg={bg} borderRadius="md" boxShadow="md">
      <Flex gap={6} wrap="nowrap" justify="space-between">
        {/* Left side: Today */}
        <Box flex="1">
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Today’s Forecast
          </Text>
          <VStack align="start" spacing={3}>
            <Flex align="center">
              <WiThermometer size={28} />
              <Text ml={2}>Temp: {current.temperature_2m} °C</Text>
            </Flex>
            <Flex align="center">
              <WiHumidity size={28} />
              <Text ml={2}>Humidity: {current.relative_humidity_2m}%</Text>
            </Flex>
            <Flex align="center">
              <WiStrongWind size={28} />
              <Text ml={2}>Wind: {current.wind_speed_10m} km/h</Text>
            </Flex>
            <Text>Feels like: {current.apparent_temperature} °C</Text>
            <Text>Precipitation: {current.precipitation} mm</Text>
          </VStack>
        </Box>

        {/* Right side: Weekly */}
        <Box flex="2">
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Weekly Forecast
          </Text>
          <Flex justify="space-between" wrap="nowrap">
            {daily.time.map((day: string, idx: number) => (
              <VStack
                key={day}
                p={2}
                borderRadius="md"
                boxShadow="sm"
                bg="whiteAlpha.100"
                flex="1"
                minW="0"
              >
                <Text fontSize="sm" fontWeight="semibold">
                  {new Date(day).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                  })}
                </Text>
                {getWeatherIcon(daily.weather_code[idx])}
                <Text fontSize="sm">↑ {daily.temperature_2m_max[idx]} °C</Text>
                <Text fontSize="sm">↓ {daily.temperature_2m_min[idx]} °C</Text>
                <Text fontSize="xs">
                  ☀ {daily.sunrise[idx].split("T")[1]}
                </Text>
                <Text fontSize="xs">
                  🌙 {daily.sunset[idx].split("T")[1]}
                </Text>
              </VStack>
            ))}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default WeatherDashboard;
