import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "@/app/lib/api";
import { SensorData } from "@/app/types";
import { useBreakpointValue } from "@chakra-ui/react";

const FruitSizeChart = () => {
  const xAxisName = "Taille des fruits";
  const yAxisName = "Taille (mm)";
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<SensorData[]>("/api/sensors/fruitsize/")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch fruit size data:", err))
      .finally(() => setLoading(false));
  }, []);

  const chartData = data.map((item) => ({
    name: item.timestamp, // x-axis: human readable time
    value: item.value,
    color: item.color || "#8884d8", // fallback color
  }));

  const labelInterval = useBreakpointValue({
    base: Math.ceil(chartData.length / 4),
    md: Math.ceil(chartData.length / 10),
  });
  const labelAngle = useBreakpointValue({ base: -15, md: -5 });
  return (
    <div style={{ width: "100%", height: 400 }}>
      {loading || data.length === 0 ? (
        <p>Chargement...</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={labelAngle}
              textAnchor="middle"
              interval={labelInterval}
            />

            <YAxis
              label={{ value: yAxisName, angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              name= {xAxisName}
              fill="#82ca9d"
              activeBar={<Rectangle fill="gold" stroke="purple" />}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default FruitSizeChart;
