import React, { useEffect, useState } from "react";
import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import DateRangePicker from "../analytics/DateRangePicker";
import api from "@/app/lib/api";
import getActiveGraphs, {
  ActiveGraphResponse,
} from "@/app/utils/getActiveGraphs";

// Soil-specific components
import WaterSoilMain from "../analytics/SoilWater/WaterSoilMain";
import PhSoilMain from "../analytics/SoilPh/PhSoilMain";
import SoilSalinityConductivityMain from "../analytics/SoilSalinityConductivity/SoilSalinityConductivityMain";
import SoilConductivityIrrigationMain from "../analytics/SoilConductivityIrrigation/SoilConductivityIrrigationMain";

const SoilMain = () => {
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [activeGraph, setActiveGraph] = useState<ActiveGraphResponse | null>(
    null
  );

  const { bg, textColor } = useColorModeStyles();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const filters = { startDate, endDate, selectedZone };

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await api.get("/api/zones-names-per-user/");
        setZones(res.data || []);
        if (res.data.length > 0) setSelectedZone(res.data[0].id);
      } catch (error) {
        console.error("Failed to fetch zones", error);
      }
    };
    fetchZones();
  }, []);

  useEffect(() => {
    if (selectedZone !== null) {
      getActiveGraphs(selectedZone).then(setActiveGraph);
    }
  }, [selectedZone]);

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <HStack>
          <Text color={textColor}>Données sur le sol du </Text>
          <select
            value={selectedZone ?? ""}
            onChange={(e) => setSelectedZone(Number(e.target.value))}
            style={{
              borderRadius: "2px",
              padding: "4px",
              color: useColorModeValue("black", "white"),
              border: `1px solid ${useColorModeValue("black", "white")}`,
            }}
          >
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        </HStack>
      </Box>

      <Box bg={bg} className="header" mt={0} mb={0}>
        <DateRangePicker
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          zones={zones}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
        />
      </Box>

      {/* Conditionally render based on activeGraph */}
      {activeGraph?.soil_irrigation_status && (
        <Box bg={bg} className="box wide">
          <WaterSoilMain filters={filters} />
        </Box>
      )}
      {activeGraph?.soil_ph_status && (
        <Box bg={bg} className="box wide">
          <PhSoilMain filters={filters} />
        </Box>
      )}
      {activeGraph?.soil_conductivity_status && (
        <Box bg={bg} className="box wide">
          <SoilSalinityConductivityMain filters={filters} />
        </Box>
      )}
      {activeGraph?.soil_moisture_status && (
        <Box bg={bg} className="box wide">
          <SoilConductivityIrrigationMain filters={filters} />
        </Box>
      )}
    </div>
  );
};

export default SoilMain;
