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
        const response = await axiosInstance.get(`/auth/modify-user/?username=${user}`);
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
  }, [user,toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
          description: "User data updated successfully.",
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
    <Box bg={bg} color={textColor} p={5} borderRadius="lg" boxShadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Modify User
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="username" isReadOnly>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              value={formData.username}
              placeholder="Username"
              isReadOnly
            />
          </FormControl>

          <FormControl id="firstname" isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Enter first name"
            />
          </FormControl>

          <FormControl id="lastname" isRequired>
            <FormLabel>Last Name</FormLabel>
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
            <FormLabel>Phone Number</FormLabel>
            <Input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </FormControl>

          <FormControl id="user_type" isRequired>
            <FormLabel>User Type</FormLabel>
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
            Update
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ModifyUser;
