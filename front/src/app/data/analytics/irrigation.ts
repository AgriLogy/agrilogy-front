export interface SensorData {
	timestamp: string;
	depth: number;
	humidity_20: number;
	humidity_40: number;
	humidity_60: number;
	irrigation: number;
  }
  
  // Génération de données fictives
  export const generateDummyData = (): { timestamp: string; sensors: SensorData[] }[] => {
	const data: { timestamp: string; sensors: SensorData[] }[] = [];
  
	for (let i = 0; i < 10; i++) { // Générer 10 entrées
	  const timestamp = new Date(Date.now() - i * 10 * 60 * 1000).toISOString(); // Données toutes les 10 minutes
  
	  const sensorData: SensorData = {
		timestamp,
		depth: 20, // On peut changer cela pour d'autres capteurs
		humidity_20: parseFloat((10 + Math.random() * 90).toFixed(1)), // Humidité entre 10% et 100%
		humidity_40: parseFloat((10 + Math.random() * 90).toFixed(1)),
		humidity_60: parseFloat((10 + Math.random() * 90).toFixed(1)),
		irrigation: parseFloat((1 + Math.random() * 20).toFixed(1)), // Taux d'irrigation entre 1 et 20
	  };
  
	  data.push({ timestamp, sensors: [sensorData] });
	}
  
	return data;
  };
  
  // Exemple de données générées
  export const data: { timestamp: string; sensors: SensorData[] }[] = generateDummyData();
  