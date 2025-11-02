import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SensorData } from "@/app/types";
import api from "@/app/lib/api";
import CumulPrecipitationChart from "./CumulPrecipitationChart";
import CumulPrecipitationLastData from "./CumulPrecipitationLastData";

const CumulPrecipitationMain = ({
  filters,
}: {
  filters: {
    startDate: string;
    endDate: string;
    selectedZone: number | null;
  };
}) => {
  const { startDate, endDate, selectedZone } = filters;
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<SensorData[]>("/api/sensors/precipitationrate/", {
        params: {
          start_date: startDate,
          end_date: endDate,
          zone: selectedZone,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch precipitation data:", err))
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
        <CumulPrecipitationChart data={data} loading={loading} />
      </Box>
      <Box flex={1} p={3} height="100%" width="100%">
        <CumulPrecipitationLastData data={data} />
      </Box>
    </Stack>
  );
};

export default CumulPrecipitationMain;
