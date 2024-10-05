// data/conductivityData.ts
export interface ConductivityData {
	formatted_timestamp: string;
	conductivity: number;
	irrigation: number;
  }
  
  // Generate dummy data
  export const conductivityData: ConductivityData[] = Array.from({ length: 10 }, (_, index) => ({
	timestamp: new Date(Date.now() - index * 60 * 60 * 1000).toISOString(), // One hour apart
	conductivity: Math.random() * 5, // Random conductivity between 0 and 5 mS/cm
	irrigation: Math.floor(Math.random() * 100), // Random irrigation volume between 0 and 100 L
  }));
  