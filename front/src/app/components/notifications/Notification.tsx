import React from "react";
import { Text, Box } from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";

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
  const { bg, textColor, hoverColor } = useColorModeStyles();
  const notificationDate = new Date(notification.notification_date);
  const formattedDate = notificationDate.toLocaleString("fr-FR");

  return (
    <Box
      bg={bg}
      p={4}
      borderWidth="1px"
      borderRadius="xl"
      boxShadow="md"
      className="wide"
      _hover={{ borderColor: hoverColor }}
      color={textColor}
    >
      {/* <Text fontWeight="bold">{is_read ? "✅ Lu" : "📩 Non lu"}</Text> */}
      <Text fontSize="sm" mt={2}>📅 {formattedDate}</Text>

      <Box mt={4}>
        <Text fontWeight="bold" fontSize="md">🌡️ Température</Text>
        <Text>• Hier : {notification.yesterday_temperature}°C</Text>
        <Text>• Aujourd’hui : {notification.today_temperature}°C</Text>
      </Box>

      <Box mt={3}>
        <Text fontWeight="bold" fontSize="md">💧 Humidité</Text>
        <Text>• Hier : {notification.yesterday_humidity}%</Text>
        <Text>• Aujourd’hui : {notification.today_humidity}%</Text>
      </Box>

      <Box mt={3}>
        <Text fontWeight="bold" fontSize="md">🔎 ET0</Text>
        <Text>{notification.ET0} mm</Text>
      </Box>

      <Box mt={3}>
        <Text fontWeight="bold" fontSize="md">🌱 Sol</Text>
        <Text>• Humidité : {notification.soil_humidity}%</Text>
        <Text>• Température : {notification.soil_temperature}°C</Text>
        <Text>• pH : {notification.soil_ph}</Text>
      </Box>

      <Box mt={3}>
        <Text fontWeight="bold" fontSize="md">🚰 Irrigation</Text>
        <Text>• Période idéale : {notification.perfect_irrigation_period}</Text>
        <Text>• Dernière date : {notification.last_irrigation_date}</Text>
        <Text>• Eau utilisée : {notification.used_water_irrigation} litres</Text>
      </Box>
    </Box>
  );
};

export default Notification;
