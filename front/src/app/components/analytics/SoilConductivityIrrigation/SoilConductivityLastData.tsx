import { Box, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { SensorData } from "@/app/types";
import { FaWater, FaTint } from "react-icons/fa";
import useColorModeStyles from "@/app/utils/useColorModeStyles";

const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMin = Math.floor((now.getTime() - then.getTime()) / 60000);
  const diffH = Math.floor(diffMin / 60);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `${diffMin} min.`;
  if (diffH < 24) return `${diffH} heures`;
  return then.toLocaleDateString();
};

const SoilConductivityLastData = ({
  lowData,
  highData,
  flowData,
}: {
  lowData: SensorData[];
  highData: SensorData[];
  flowData: SensorData[];
}) => {
  const latestLow = lowData[lowData.length - 1];
  const latestHigh = highData[highData.length - 1];
  const latestFlow = flowData[flowData.length - 1];
  
  const bgColor = useColorModeValue("blue.50", "blue.900");
  const timeColor = useColorModeValue("gray.500", "gray.400");
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
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <FaWater size={40} color="#319795" />
      <Text fontWeight="bold" fontSize="lg" mt={2} color={textColor}>
        Derniers niveaux EC du sol & irrigation
      </Text>

      <VStack spacing={3} mt={4}>
        <Text fontSize="lg" color="blue.500">
          Profondeur basse :{" "}
          {latestLow ? `${latestLow.value.toFixed(2)} µS/cm` : "N/A"}
        </Text>
        <Text fontSize="lg" color="teal.500">
          Profondeur haute :{" "}
          {latestHigh ? `${latestHigh.value.toFixed(2)} µS/cm` : "N/A"}
        </Text>
        <Text fontSize="lg" color="red.500">
          Débit irrigation :{" "}
          {latestFlow ? `${latestFlow.value.toFixed(2)} L/min` : "N/A"}
        </Text>
      </VStack>

      {(latestLow || latestHigh || latestFlow) && (
        <Text fontSize="sm" color={timeColor} mt={3}>
          Mise à jour :{" "}
          {timeAgo(
            latestFlow?.timestamp ||
              latestHigh?.timestamp ||
              latestLow?.timestamp ||
              ""
          )}
        </Text>
      )}
    </Box>
  );
};

export default SoilConductivityLastData;
