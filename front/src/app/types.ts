export interface AlertProps {
	alert: {
	  name: string;
	  type: string;
	  condition: string; // For example: "<=", ">", etc.
	  value: number; // The threshold value for the alert
	  description: string;
	  created_at: string; // Date when the alert was created
	};
  }