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
  Box,
  Link,
} from "@chakra-ui/react";
import useAxiosInstance from "@/app/lib/axiosInstance";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import useColorModeStyles from "@/app/utils/useColorModeStyles";

interface User {
  username: string;
  email: string;
  is_active: boolean;
  user_type: string;
  payement_status: string;
}

const ListeUsers = () => {
  const axiosInstance = useAxiosInstance();
  const [users, setUsers] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const { bg, textColor, hoverColor, navBgColor } = useColorModeStyles();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get<User[]>("/auth/users"); // Replace with your actual endpoint
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
    <Box p={5} bg={bg}>
      <TableContainer bg={navBgColor} borderRadius="lg" boxShadow="md">
        <Table variant="striped" colorScheme="blue">
          <Thead>
            <Tr>
              <Th color={textColor}>
                <Button
                fontWeight={800}
                  variant="ghost"
                  onClick={() => sortUsers("username")}
                  color={textColor}
                  _hover={{ color: hoverColor }}
                  rightIcon={
                    sortConfig.key === "username" &&
                    sortConfig.direction === "asc" ? (
                      <ChevronUpIcon />
                    ) : sortConfig.key === "username" ? (
                      <ChevronDownIcon />
                    ) : undefined
                  }
                >
                  Username
                </Button>
              </Th>
              <Th color={textColor}>
                <Button
                  variant="ghost"
                  onClick={() => sortUsers("email")}
                  color={textColor}
                  _hover={{ color: hoverColor }}
                  rightIcon={
                    sortConfig.key === "email" &&
                    sortConfig.direction === "asc" ? (
                      <ChevronUpIcon />
                    ) : sortConfig.key === "email" ? (
                      <ChevronDownIcon />
                    ) : undefined
                  }
                >
                  Email
                </Button>
              </Th>
              <Th color={textColor}>
                <Button
                  variant="ghost"
                  onClick={() => sortUsers("is_active")}
                  color={textColor}
                  _hover={{ color: hoverColor }}
                  rightIcon={
                    sortConfig.key === "is_active" &&
                    sortConfig.direction === "asc" ? (
                      <ChevronUpIcon />
                    ) : sortConfig.key === "is_active" ? (
                      <ChevronDownIcon />
                    ) : undefined
                  }
                >
                  Active Status
                </Button>
              </Th>
              <Th color={textColor}>
                <Button
                  variant="ghost"
                  onClick={() => sortUsers("user_type")}
                  color={textColor}
                  _hover={{ color: hoverColor }}
                  rightIcon={
                    sortConfig.key === "user_type" &&
                    sortConfig.direction === "asc" ? (
                      <ChevronUpIcon />
                    ) : sortConfig.key === "user_type" ? (
                      <ChevronDownIcon />
                    ) : undefined
                  }
                >
                  User Type
                </Button>
              </Th>
              <Th color={textColor}>
                <Button
                  variant="ghost"
                  onClick={() => sortUsers("payement_status")}
                  color={textColor}
                  _hover={{ color: hoverColor }}
                  rightIcon={
                    sortConfig.key === "payement_status" &&
                    sortConfig.direction === "asc" ? (
                      <ChevronUpIcon />
                    ) : sortConfig.key === "payement_status" ? (
                      <ChevronDownIcon />
                    ) : undefined
                  }
                >
                  Payment Status
                </Button>
              </Th>
              <Th color={textColor}>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user, index) => (
              <Tr key={index}>
                <Td color={textColor}>{user.username}</Td>
                <Td color={textColor}>{user.email}</Td>
                <Td color={textColor}>
                  {user.is_active ? "Active" : "Inactive"}
                </Td>
                <Td color={textColor}>{user.user_type}</Td>
                <Td color={textColor}>{user.payement_status}</Td>
                <Td>
                  <Link
                    href={`/data/${user.username}`}
                    color={hoverColor}
                    textDecoration="underline"
                  >
                    View
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListeUsers;
