// PlantMain.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";

import useColorModeStyles from "@/app/utils/useColorModeStyles";
import api from "@/app/lib/api";
import "@/app/styles/style.css";

import DateRangePicker from "../analytics/DateRangePicker";
import ElectricityconsumptionMain from "../analytics/Electricityconsumption/ElectricityconsumptionMain";
import FruiteSizeMain from "../analytics/fruiteSize/FruiteSizeMain";
import LargeFruitDiameterMain from "../analytics/LargeFruitDiameter/LargeFruitDiameterMain";
import SensorLeafMain from "../analytics/Leaf/SensorLeafMain";
import NpkMain from "../analytics/npk/NpkMain";
import EcWaterMain from "../analytics/WaterEc/EcWaterMain";
import WaterFlowMain from "../analytics/WaterFlow/WaterFlowMain";
import PhWaterMain from "../analytics/WaterPh/PhWaterMain";
import WaterPressureMain from "../analytics/WaterPressure/WaterPressureMain";

// Plants components


const PlantMain = () => {
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

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

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <HStack>
          <Text color={textColor}>Données des plantes du </Text>
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

      {/* Station météo Data Components */}
      <Box bg={bg} className="box wide">
        <FruiteSizeMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <LargeFruitDiameterMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <SensorLeafMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <NpkMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <ElectricityconsumptionMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <WaterFlowMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <WaterPressureMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <PhWaterMain filters={filters} />
      </Box>
      <Box bg={bg} className="box wide">
        <EcWaterMain filters={filters} />
      </Box>
    </div>
  );
};

export default PlantMain;
