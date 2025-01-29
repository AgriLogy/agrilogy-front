"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Select,
  useToast,
} from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import useAxiosInstance from "@/app/lib/axiosInstance";
import "@/app/styles/graphes.css";

type Props = {
  user: string;
};

const ModifyUser = ({ user }: Props) => {
  const axiosInstance = useAxiosInstance();
  const toast = useToast();
  const { bg, textColor, hoverColor, bgColor } = useColorModeStyles();

  const [formData, setFormData] = useState({
    username: user,
    firstname: "",
    lastname: "",
    email: "",
    phone_number: "",
    user_type: "", // Default to "regular"
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(
          `/auth/modify-user/?username=${user}`
        );
        if (response.status === 200) {
          setFormData({
            ...formData,
            ...response.data, // Populate form fields with user data
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchUserData();
  }, [user, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put("/auth/modify-user/", formData);

      if (response.status === 200) {
        toast({
          title: "Success!",
          description: "Les données utilisateur ont été mises à jour avec succès.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      toast({
        title: "Error",
        description: "Failed to update user data. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="container">
      <Box
        className="header"
        bg={bg}
        p={4}
        mb={4}
        borderRadius="md"
        boxShadow="sm"
      >
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Modifier les données de {user}
        </Text>
      </Box>
      <Box bg={bg} p={5} className="wide admin-register">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="username" isReadOnly>
              <FormLabel>Nom d'utilisateur</FormLabel>
              <Input
                type="text"
                name="username"
                value={formData.username}
                placeholder="Username"
                isReadOnly
              />
            </FormControl>

            <FormControl id="firstname" isRequired>
              <FormLabel>Prénom</FormLabel>
              <Input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </FormControl>

            <FormControl id="lastname" isRequired>
              <FormLabel>Nom</FormLabel>
              <Input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </FormControl>

            <FormControl id="phone_number">
              <FormLabel>Numéro de téléphone</FormLabel>
              <Input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </FormControl>

            <FormControl id="user_type" isRequired>
              <FormLabel>Type d'utilisateur</FormLabel>
              <Select
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                placeholder="Select user type"
              >
                <option value="regular">Regular</option>
                <option value="admin">Admin</option>
              </Select>
            </FormControl>

            <Button
              type="submit"
              bg={bgColor}
              color="white"
              _hover={{ bg: hoverColor }}
              width="100%"
            >
              Mettre à jour
            </Button>
          </VStack>
        </form>
      </Box>
    </div>
  );
};

export default ModifyUser;
