import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FruitSizeChart from "./FruitSizeChart";
import FruiteSizeLastData from "./FruiteSizeLastData";
import { SensorData } from "@/app/types";
import api from "@/app/lib/api";
import "@/app/styles/style.css";

const FruiteSizeMain = ({
  filters,
}: {
  filters: {
    startDate: string;
    endDate: string;
    selectedZone: number | null;
    // Add more fields here as needed in the future
  };
}) => {
  const { startDate, endDate, selectedZone } = filters;
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if (!selectedZone || !startDate || !endDate) return;

    api
      .get<SensorData[]>("/api/sensors/fruitsize/", {
        params: {
          start_date: startDate,
          end_date: endDate,
          zone: selectedZone,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error("Failed to fetch fruit size data:", err)
      )
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
        <FruitSizeChart data={data} loading={loading} />
      </Box>
      <Box flex={1} p={3} height={"100%"} width={"100%"}>
        <FruiteSizeLastData data={data} />
      </Box>
    </Stack>
  );
};


export default FruiteSizeMain;
