import useColorModeStyles from '@/app/utils/useColorModeStyles';
import { Box, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { GiWaterDrop } from 'react-icons/gi';

interface ET0Data {
  id: number;
  timestamp: string;
  value: number;
  default_unit: string;
}

const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);

  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `${diffMin} min.`;
  if (diffH < 24) return `${diffH} heures`;
  return then.toLocaleDateString();
};

const ET0LastData = ({
  weatherData,
  calculatedData,
}: {
  weatherData: ET0Data[];
  calculatedData: ET0Data[];
}) => {
  const latestWeather = weatherData[weatherData.length - 1];
  const latestCalculated = calculatedData[calculatedData.length - 1];

  // Light/dark mode colors
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const noDataColor = useColorModeValue('gray.600', 'gray.300');
  const timeColor = useColorModeValue('gray.500', 'gray.400');
  const { textColor } = useColorModeStyles();

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="md"
      boxShadow="md"
      minH="300px"
      minW="250px"
      height="100%"
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <GiWaterDrop size={50} color="#2B6CB0" />
      <Text fontWeight="bold" fontSize="lg" mt={2} color={textColor}>
        Dernières valeurs ET0
      </Text>

      {latestWeather || latestCalculated ? (
        <VStack spacing={2} mt={3}>
          <Text fontSize="lg" color="blue.600">
            ET0 météo:{' '}
            {latestWeather
              ? `${latestWeather.value.toFixed(2)} ${
                  latestWeather.default_unit
                }`
              : 'N/A'}
          </Text>
          <Text fontSize="lg" color="teal.600">
            ET0 calculé:{' '}
            {latestCalculated
              ? `${latestCalculated.value.toFixed(2)} ${
                  latestCalculated.default_unit
                }`
              : 'N/A'}
          </Text>
        </VStack>
      ) : (
        <Text mt={3} fontSize="md" color={noDataColor}>
          N/A
        </Text>
      )}

      {(latestWeather || latestCalculated) && (
        <Text fontSize="sm" color={timeColor} mt={3}>
          Mise à jour :{' '}
          {latestWeather && latestCalculated
            ? timeAgo(
                latestWeather.timestamp > latestCalculated.timestamp
                  ? latestWeather.timestamp
                  : latestCalculated.timestamp
              )
            : latestWeather
              ? timeAgo(latestWeather.timestamp)
              : timeAgo(latestCalculated.timestamp)}
        </Text>
      )}
    </Box>
  );
};

export default ET0LastData;
