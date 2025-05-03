"use client";
import React, { useEffect, useState } from "react";
import "./AnalyticsMain.css";
import { Box, Text } from "@chakra-ui/react";
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

const AnalyticsMain: React.FC = () => {
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  const { bg, textColor } = useColorModeStyles(); // Use the utility
  const [data, setData] = useState<SensorData[]>([]);
  // const [statusdata, setStatusData] = useState<StatusData[]>([]);
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
        if (res.data.length > 0) setSelectedZone(res.data[0].id); // default selection
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
        console.log("API Response:", response.data); // Log the API response to inspect its structure
        console.log("Irrigation stsatus", statusdata?.soil_ph_status);
        // Assuming response.data.sensor_data contains an array of SensorData
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
        <Text color={textColor}>Données sur le sol</Text>
      </Box>

      <Box bg={bg} className="header" mt={0} mb={2}>
        <Text color={textColor}>Sélectionnez une zone :</Text>
        <select
          value={selectedZone ?? ""}
          onChange={(e) => setSelectedZone(Number(e.target.value))}
          style={{ padding: "8px", borderRadius: "8px", marginTop: "5px" }}
        >
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.name}
            </option>
          ))}
        </select>
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

      {statusdata?.soil_irrigation_status && (
        <Box bg={bg} className="box wide">
          <IrrigationGraph data={data} />
        </Box>
      )}
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
