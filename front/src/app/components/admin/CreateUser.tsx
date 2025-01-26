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
  useToast,
} from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import useAxiosInstance from "@/app/lib/axiosInstance";

const CreateUser = () => {
  const axiosInstance = useAxiosInstance();
  const { bg, textColor, hoverColor, bgColor } = useColorModeStyles();
  const toast = useToast();

  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    phone_number: "",
    password: "",
    user_type: "regular",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <Box bg={bg} color={textColor} p={5} borderRadius="lg" boxShadow="md">
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
  );
};

export default CreateUser;
