import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Text,
  Box,
  Link,
} from "@chakra-ui/react";
import axiosInstance from "@/app/lib/api";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import "@/app/styles/graphes.css";
import FloatingButton from "./FloatingButton";
import AddZoneFloatingButton from "./AddZoneFloatingButton";

interface User {
  username: string;
  email: string;
  is_active: boolean;
  is_staff: string;
  payement_status: string;
}
type Props = {
  user: string;
};

const ListeZones = ({ user }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const { bg, tableStripeClore, textColor, hoverColor, navBgColor } =
    useColorModeStyles();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get<User[]>("/auth/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const sortUsers = (key: keyof User) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setUsers(sortedUsers);
  };

  return (
    <div className="container">
      <AddZoneFloatingButton user={user} />
      <Box
        className="header"
        bg={bg}
        p={4}
        mb={4}
        borderRadius="md"
        boxShadow="sm"
      >
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          {`Liste des zones de ${user}`}
        </Text>
      </Box>
      <Box bg={bg} className="wide admin-register"></Box>
    </div>
  );
};

export default ListeZones;
