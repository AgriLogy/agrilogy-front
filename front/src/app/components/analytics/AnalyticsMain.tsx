"use client";
import React, { useEffect, useState } from "react";
import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { SensorData, StatusData } from "@/app/data/dashboard/data";

import DateRangePicker from "./DateRangePicker";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import FruitSizeChart from "./FruitSizeChart";

import api from "@/app/lib/api";

import "./AnalyticsMain.css";

const AnalyticsMain = () => {
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  const { bg, textColor } = useColorModeStyles();
  const [data, setData] = useState<SensorData[]>([]);
  const [statusdata, setStatusData] = useState<StatusData | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
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
      {
        <Box bg={bg} className="box wide">
          <FruitSizeChart />
        </Box>
      }
    </div>
  );
};

export default AnalyticsMain;
