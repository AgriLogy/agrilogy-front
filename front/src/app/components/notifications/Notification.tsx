import React from 'react';
import "./style.css";


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
  };
  is_read: boolean;
  read_at: string | null;
}

const Notification: React.FC<NotificationProps> = ({ notification, is_read }) => {
  return (
    <div className="box">
      <h4>{is_read ? 'Read' : 'Unread'}</h4>
      <p><strong>Yesterday's Temperature:</strong> {notification.yesterday_temperature}°C</p>
      <p><strong>Today's Temperature:</strong> {notification.today_temperature}°C</p>
      <p><strong>Yesterday's Humidity:</strong> {notification.yesterday_humidity}%</p>
      <p><strong>Today's Humidity:</strong> {notification.today_humidity}%</p>
      <p><strong>ET0:</strong> {notification.ET0} mm</p>
      <p><strong>Soil Humidity:</strong> {notification.soil_humidity}%</p>
      <p><strong>Soil Temperature:</strong> {notification.soil_temperature}°C</p>
      <p><strong>Soil pH:</strong> {notification.soil_ph}</p>
      <p><strong>Perfect Irrigation Period:</strong> {notification.perfect_irrigation_period}</p>
      <p><strong>Last Irrigation Date:</strong> {notification.last_irrigation_date}</p>
      <p><strong>Last Irrigation Hour:</strong> {notification.last_start_irrigation_hour}</p>
      <p><strong>Water Used in Irrigation:</strong> {notification.used_water_irrigation} liters</p>
    </div>
  );
};

export default Notification;
