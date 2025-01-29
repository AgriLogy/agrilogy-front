"use client";

import React, { useState } from "react";
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

const CreateUser = () => {
  const axiosInstance = useAxiosInstance();
  const toast = useToast();
  const { bg, textColor, hoverColor, bgColor } = useColorModeStyles();

  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    phone_number: "",
    password: "",
    user_type: "regular", // Default to "regular"
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/signup/", formData);

      if (response.status === 201) {
        toast({
          title: "Success!",
          description: "User registered successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error("Error registering user:", error);
      toast({
        title: "Error",
        description: "Failed to register user. Please try again.",
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
          New user 
        </Text>
      </Box>
      <Box bg={bg} color={textColor} p={5} borderRadius="lg" boxShadow="md" className="wide admin-register">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Create New User
        </Text>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
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

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </FormControl>

            {/* User Type Dropdown */}
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
              Register
            </Button>
          </VStack>
        </form>
      </Box>
    </div>
  );
};

export default CreateUser;
