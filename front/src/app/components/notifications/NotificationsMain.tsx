"use client";
import React, { useEffect, useState } from "react";
import "./NotificationsMain.css";
import { Box, Text, VStack } from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import LoadingSpinner from "../common/LoadingSpinner";
import Notification from "../notifications/Notification";
import axiosInstance from "@/app/lib/api";

const NotificationsMain: React.FC = () => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility
  const [notifications, setNotifications] = useState<any[]>([]);
  // const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch notifications and alerts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/notifications-and-alerts/"
        );
        setNotifications(response.data.notifications);
        // setAlerts(response.data.alerts);
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

      {/* <Box bg={bg} className="   wide"> */}
      {/* Render Notifications */}
      <VStack spacing={4} align="stretch">
        {notifications.map((notification) => (
          <Box key={notification.id} className="box" height="100%" gridColumn="span 2;">
            <Notification
              id={notification.id}
              notification={notification.notification}
              is_read={notification.is_read}
              read_at={notification.read_at}
            />
          </Box>
        ))}
      </VStack>
      {/* </Box> */}
    </div>
  );
};

export default NotificationsMain;
