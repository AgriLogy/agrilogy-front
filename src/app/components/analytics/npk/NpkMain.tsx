import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import "@/app/styles/style.css";
import NpkLastData from "./NpkLastData";
import NpkSizeChart from "./NpkSizeChart";
import { NpkSensorData } from "@/app/types";

const NpkMain = ({
  filters,
}: {
  filters: {
    startDate: string;
    endDate: string;
    selectedZone: number | null;
  };
}) => {
  const { startDate, endDate, selectedZone } = filters;
  const [data, setData] = useState<NpkSensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<NpkSensorData[]>("/api/sensors/npk/", {
        params: {
          start_date: startDate,
          end_date: endDate,
          zone: selectedZone,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch NPK sensor data:", err))
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
      <Box flex={3} p={2} height={"100%"} width={"100%"}>
        <NpkSizeChart data={data} loading={loading} />
      </Box>
      <Box flex={1} p={3} height={"100%"} width={"100%"}>
        <NpkLastData data={data} />
      </Box>
    </Stack>
  );
};

export default NpkMain;
