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
import api from "@/app/lib/api";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import "@/app/styles/graphes.css";
import FloatingButton from "./FloatingButton";

interface User {
  username: string;
  email: string;
  is_active: boolean;
  is_staff: string;
  payement_status: string;
}

const ListeUsers = () => {
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
        const response = await api.get<User[]>("/auth/users");
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
      <FloatingButton />
      <Box
        className="header"
        bg={bg}
        p={4}
        mb={4}
        borderRadius="md"
        boxShadow="sm"
      >
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Liste des utilisateurs
        </Text>
      </Box>
      <Box bg={bg} className="wide admin-register">
        <TableContainer bg={navBgColor} borderRadius="lg" boxShadow="md">
          <Table
            variant="striped"
            sx={{
              border: "1px solid",
              borderColor: textColor,
              th: {
                borderBottom: "2px solid",
                borderColor: textColor,
                textAlign: "left",
              },
              tr: {
                borderBottom: "2px solid",
                borderColor: textColor,
                textAlign: "left",
              },
              td: {
                borderBottom: "1px solid",
                borderColor: textColor,
                textAlign: "left",
              },
              tbody: { tr: { "&:nth-of-type(odd)": { bg: tableStripeClore } } },
            }}
          >
            <Thead>
              <Tr>
                <Th color={textColor}>
                  <Button
                    fontWeight={700}
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
                    fontWeight={700}
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
                    fontWeight={700}
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
                    Status
                  </Button>
                </Th>
                <Th color={textColor}>
                  <Button
                    fontWeight={700}
                    variant="ghost"
                    onClick={() => sortUsers("is_staff")}
                    color={textColor}
                    _hover={{ color: hoverColor }}
                    rightIcon={
                      sortConfig.key === "is_staff" &&
                      sortConfig.direction === "asc" ? (
                        <ChevronUpIcon />
                      ) : sortConfig.key === "is_staff" ? (
                        <ChevronDownIcon />
                      ) : undefined
                    }
                  >
                    Type
                  </Button>
                </Th>
                <Th color={textColor}>
                  <Button
                    fontWeight={700}
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
                    Payment
                  </Button>
                </Th>
                <Th color={textColor}>
                  <Button> Sol </Button>
                </Th>
                <Th color={textColor}>
                  <Button> Station </Button>
                </Th>
                <Th color={textColor}>
                  <Button> Zones </Button>
                </Th>
                <Th color={textColor}>
                  <Button> Graphiques </Button>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user, index) => (
                <Tr key={index}>
                  <Td color={textColor}>
                    {" "}
                    <Link
                      href={`/admin/users/modify/${user.username}`}
                      color={hoverColor}
                      textDecoration="underline"
                    >
                      {user.username}
                    </Link>
                  </Td>
                  <Td color={textColor}>{user.email}</Td>
                  <Td color={textColor}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Td>
                  <Td color={textColor}>
                    {user.is_staff ? "Admin" : "Regular"}
                  </Td>
                  <Td color={textColor}>{user.payement_status}</Td>
                  <Td>
                    <Link
                      href={`/admin/users/data/soil/${user.username}`}
                      color={hoverColor}
                      textDecoration="underline"
                    >
                      Voire
                    </Link>
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/users/data/station/${user.username}`}
                      color={hoverColor}
                      textDecoration="underline"
                    >
                      Voire
                    </Link>
                  </Td>{" "}
                  <Td>
                    <Link
                      href={`/admin/zone-per-user/${user.username}`}
                      color={hoverColor}
                      textDecoration="underline"
                    >
                      Voire
                    </Link>
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/graph-per-user/${user.username}`}
                      color={hoverColor}
                      textDecoration="underline"
                    >
                      Voire
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default ListeUsers;
