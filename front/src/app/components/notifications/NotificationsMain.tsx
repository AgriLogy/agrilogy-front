"use client";
import React, { useEffect, useState } from "react";
import "./NotificationsMain.css";
import { Alert, Box, Text } from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import LoadingSpinner from "../common/LoadingSpinner";
import Notification from "../notifications/Notification";
import useAxiosInstance from "@/app/lib/axiosInstance";


const NotificationsMain: React.FC = () => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility
  const [notifications, setNotifications] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const axiosInstance = useAxiosInstance();


  // Fetch notifications and alerts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/notifications");
        setNotifications(response.data.notifications);
        setAlerts(response.data.alerts);
        console.log('===============================')
        console.log(response.data)
        console.log('===============================')
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <Box bg={bg} className="header">
        <Text color={textColor}>Notifications</Text>
      </Box>

      <Box bg={bg} >
        {/* Render Notifications */}
        <Box>
          <Text fontSize="lg" color={textColor}>Notifications</Text>
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              id={notification.id}
              notification={notification.notification}
              is_read={notification.is_read}
              read_at={notification.read_at}
            />
          ))}
        </Box>

        {/* Render Alerts */}
        <Box mt={4}>
          <Text fontSize="lg" color={textColor}>Alerts</Text>
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              id={alert.id}
              alert={alert.alert}
              is_read={alert.is_read}
              read_at={alert.read_at}
            />
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default NotificationsMain;
