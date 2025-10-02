"use client";
import React, { useEffect, useState } from "react";
import "./NotificationsMain.css";
import { Box, Text, SimpleGrid } from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import Notification from "../notifications/Notification";
import axiosInstance from "@/app/lib/api";
import EmptyBox from "../common/EmptyBox";

const NotificationsMain: React.FC = () => {
  const { bg, textColor } = useColorModeStyles(); // Use the utility
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/notifications-and-alerts/"
        );
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <EmptyBox />;

  return (
    <>
      <Box bg={bg} className="header">
        <Text color={textColor}>Notifications</Text>
      </Box>

      <SimpleGrid m={1} mt={4} spacing={4} columns={{ base: 1, sm: 2, md: 3, lg: 4 }}>
        {notifications.map((notification) => (
          <Box >
            <Notification
              id={notification.id}
              notification={notification.notification}
              is_read={notification.is_read}
              read_at={notification.read_at}
            />
          </Box>
        ))}
      </SimpleGrid>
    </>
  );
};

export default NotificationsMain;
