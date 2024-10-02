// app/data/analytics/temperature.ts
export interface TemperatureData {
	timestamp: string;
	temperature: number;
  }
  
  export const temperatureData: TemperatureData[] = [
	{ timestamp: '2023-09-01', temperature: 25 },
	{ timestamp: '2023-09-02', temperature: 27 },
	{ timestamp: '2023-09-03', temperature: 23 },
	{ timestamp: '2023-09-04', temperature: 28 },
	{ timestamp: '2023-09-05', temperature: 22 },
	{ timestamp: '2023-09-06', temperature: 30 },
	{ timestamp: '2023-09-07', temperature: 26 },
  ];
  