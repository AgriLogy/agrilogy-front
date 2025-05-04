"use client";
import React, { useEffect, useState } from "react";
import "./AnalyticsMain.css";
import { Box, HStack, Text } from "@chakra-ui/react";
import IrrigationGraph from "./IrrigationGraph";
import PhGraph from "./PhGraph";
import DateRangePicker from "./DateRangePicker";
import ConductivityIrrigationGraph from "./ConductivityIrrigationGraph";
// import CumulIrrigationGraph from "./CumulIrrigationGraph";
import TemperatureGraph from "./TemperatureGraph";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import axiosInstance from "@/app/lib/api";
import { SensorData, StatusData } from "@/app/data/dashboard/data";
import EmptyBox from "../common/EmptyBox";
import CumulIrrigationGraph from "./CumulIrrigationGraph";
import api from "@/app/lib/api";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          start_date: startDate,
          end_date: endDate,
          ...(selectedZone && { zone_id: selectedZone }),
        };
        const response = await axiosInstance.get("/api/all-sensor-data/", {
          params,
        });
        const sensorData: SensorData[] = response.data || [];
        const sensorStatusData: StatusData = response.data.sensor_status;

        setData(sensorData);
        setStatusData(sensorStatusData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };
    fetchData();
  }, [startDate, endDate, selectedZone]);

  if (error) return <EmptyBox />;

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
              color: textColor, // 'gray.800' in light mode, 'gray.200' in dark mode
              border: `1px solid ${bg}`, // Optional: ensure border is visible
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

      {/* {statusdata?.soil_irrigation_status && (
        <Box bg={bg} className="box wide">
          <IrrigationGraph data={data} />
        </Box>
      )} */}
      {statusdata?.soil_ph_status && (
        <Box bg={bg} className="box wide">
          <PhGraph data={data} />
        </Box>
      )}
      {statusdata?.soil_conductivity_status && (
        <Box bg={bg} className="box wide">
          <ConductivityIrrigationGraph data={data} />
        </Box>
      )}
      {/* {statusdata?.precipitation_rate_status &&
        
          <Box bg={bg} className="box wide">
        <CumulIrrigationGraph data={data} />
        </Box> 
        } */}
      {statusdata?.soil_temperature_status && (
        <Box bg={bg} className="box wide">
          <TemperatureGraph data={data} />
        </Box>
      )}
    </div>
  );
};

export default AnalyticsMain;
