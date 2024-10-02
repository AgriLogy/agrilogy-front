export interface CumulData {
	timestamp: string;
	cumul: number;
  }
  
  // Exemple de données de cumul d'irrigation
  export const cumulData: CumulData[] = [
	{ timestamp: "2024-09-13T12:00:00", cumul: 0 },
	{ timestamp: "2024-09-13T12:10:00", cumul: 5 },
	{ timestamp: "2024-09-13T12:20:00", cumul: 10 },
	{ timestamp: "2024-09-13T12:30:00", cumul: 15 },
	{ timestamp: "2024-09-13T12:40:00", cumul: 20 },
	{ timestamp: "2024-09-13T12:50:00", cumul: 25 },
	{ timestamp: "2024-09-13T13:00:00", cumul: 30 },
	{ timestamp: "2024-09-13T13:10:00", cumul: 35 },
	{ timestamp: "2024-09-13T13:20:00", cumul: 40 },
	{ timestamp: "2024-09-13T13:30:00", cumul: 45 },
	{ timestamp: "2024-09-13T13:40:00", cumul: 50 },
  ];
  