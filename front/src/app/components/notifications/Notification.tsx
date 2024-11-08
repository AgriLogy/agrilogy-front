import React from "react";
import { Text, Box } from "@chakra-ui/react"; // Import Chakra UI components
import "./Notification.css"; // Ensure that you have the necessary CSS file

interface NotificationProps {
  id: number;
  notification: {
    yesterday_temperature: string;
    today_temperature: string;
    yesterday_humidity: string;
    today_humidity: string;
    ET0: string;
    soil_humidity: string;
    soil_temperature: string;
    soil_ph: string;
    perfect_irrigation_period: string;
    last_irrigation_date: string;
    last_start_irrigation_hour: string;
    last_finish_irrigation_hour: string;
    used_water_irrigation: string;
    notification_date: string;
  };
  is_read: boolean;
  read_at: string | null;
}

const Notification: React.FC<NotificationProps> = ({ notification, is_read }) => {
  // Parse and format the notification date
  const notificationDate = new Date(notification.notification_date);
  const formattedDate = notificationDate.toLocaleString();

  return (
    <Box  p={4} borderWidth={1} width="100%">
      {/* Status */}
      <Box className="status">
        <Text fontWeight="bold">{is_read ? "Read" : "Unread"}</Text>
      </Box>

      {/* Notification Date */}
      
      <Box className="section notification-date" mt={4}>
        <Text fontWeight="bold">Notification Date 📅</Text>
        <Text>{formattedDate}</Text>
      </Box>

      {/* Temperature Section */}
      <Box className="section temperature" mt={4}>
        <Text fontSize="lg" fontWeight="bold">🌡️ <strong>Temperatures</strong></Text>
        <Text><strong>Yesterday:</strong> {notification.yesterday_temperature}°C</Text>
        <Text><strong>Today:</strong> {notification.today_temperature}°C</Text>
      </Box>

      {/* Humidity Section */}
      <Box className="section humidity" mt={4}>
        <Text fontSize="lg" fontWeight="bold">💧 <strong>Humidity</strong></Text>
        <Text><strong>Yesterday:</strong> {notification.yesterday_humidity}%</Text>
        <Text><strong>Today:</strong> {notification.today_humidity}%</Text>
      </Box>

      {/* ET0 Section */}
      <Box className="section et0" mt={4}>
        <Text fontSize="lg" fontWeight="bold">💧 <strong>ET0</strong></Text>
        <Text><strong>ET0:</strong> {notification.ET0} mm</Text>
      </Box>

      {/* Soil Conditions Section */}
      <Box className="section soil-conditions" mt={4}>
        <Text fontSize="lg" fontWeight="bold">🌱 <strong>Soil Conditions</strong></Text>
        <Text><strong>Soil Humidity:</strong> {notification.soil_humidity}%</Text>
        <Text><strong>Soil Temperature:</strong> {notification.soil_temperature}°C</Text>
        <Text><strong>Soil pH:</strong> {notification.soil_ph}</Text>
      </Box>

      {/* Irrigation Details Section */}
      <Box className="section irrigation" mt={4}>
        <Text fontSize="lg" fontWeight="bold">🚰 <strong>Irrigation Details</strong></Text>
        <Text><strong>Perfect Irrigation Period:</strong> {notification.perfect_irrigation_period}</Text>
        <Text><strong>Last Irrigation Date:</strong> {notification.last_irrigation_date}</Text>
        <Text><strong>Water Used in Irrigation:</strong> {notification.used_water_irrigation} liters</Text>
      </Box>
    </Box>
  );
};

export default Notification;
