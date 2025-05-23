"use client";
import React, { useEffect, useState } from "react";
import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";

import DateRangePicker from "./DateRangePicker";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import FruiteSizeMain from "./fruiteSize/FruiteSizeMain";

import api from "@/app/lib/api";

import "@/app/styles/style.css";
import NpkMain from "./npk/NpkMain";
import ElectricityconsumptionMain from "./Electricityconsumption/ElectricityconsumptionMain";
import LargeFruitDiameterMain from "./LargeFruitDiameter/LargeFruitDiameterMain";
import PhWaterMain from "./WaterPh/PhWaterMain";
import SoilSalinityConductivityMain from "./SoilSalinityConductivity/SoilSalinityConductivityMain";
import SoilConductivityIrrigationMain from "./SoilConductivityIrrigation/SoilConductivityIrrigationMain";
import EcWaterMain from "./WaterEc/EcWaterMain";
import WaterFlowMain from "./WaterFlow/WaterFlowMain";
import WaterPressureMain from "./WaterPressure/WaterPressureMain";
import PhSoilMain from "./SoilPh/PhSoilMain";
import PrecipitationRateMain from "./PrecipitationRate/PrecipitationRateMain";

const AnalyticsMain = () => {
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  const { bg, textColor } = useColorModeStyles();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const filters = {
    startDate,
    endDate,
    selectedZone,
  };
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

  // if (error) return <EmptyBox />;

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
              color: useColorModeValue("black", "white"), // 'gray.800' in light mode, 'gray.200' in dark mode
              border: `1px solid ${useColorModeValue("black", "white")}`, // Optional: ensure border is visible
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

      <Box bg={bg} className="box wide">
        <PrecipitationRateMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <PhSoilMain filters={filters} />
      </Box>

      <Box bg={bg} className="box wide">
        <WaterFlowMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <WaterPressureMain filters={filters} />
      </Box>

      <Box bg={bg} className="box wide">
        <FruiteSizeMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <NpkMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <ElectricityconsumptionMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <LargeFruitDiameterMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <PhWaterMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <EcWaterMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <SoilSalinityConductivityMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <SoilConductivityIrrigationMain filters={filters} />
      </Box>
    </div>
  );
};

export default AnalyticsMain;
