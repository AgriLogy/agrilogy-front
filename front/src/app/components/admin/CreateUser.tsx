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
import axiosInstance from "@/app/lib/api";
import "@/app/styles/graphes.css";

const CreateUser = () => {
  const toast = useToast();
  const { bg, textColor, hoverColor, bgColor } = useColorModeStyles();

  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    phone_number: "",
    password: "",
    is_staff: "",
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
      const response = await axiosInstance.post(
        "/auth/admin-signup/",
        formData
      );

      if (response.status === 201) {
        toast({
          title: "Success!",
          description: "Utilisateur enregistré avec succès.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error("Error registering user:", error);
      toast({
        title: "Error",
        description:
          "Impossible d'enregistrer l'utilisateur. Veuillez réessayer.",
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
          Créer un utilisateur
        </Text>
      </Box>
      <Box
        bg={bg}
        color={textColor}
        p={5}
        borderRadius="lg"
        boxShadow="md"
        className="wide admin-register"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="username" isRequired>
              <FormLabel>Nom d&apos;utilisateur</FormLabel>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </FormControl>

            <FormControl id="firstname" isRequired>
              <FormLabel>Nom</FormLabel>
              <Input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </FormControl>

            <FormControl id="lastname" isRequired>
              <FormLabel>Prénom</FormLabel>
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

            <FormControl id="password" isRequired>
              <FormLabel>Mot de passe</FormLabel>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </FormControl>

            {/* User Type Dropdown */}
            <FormControl id="is_staff" isRequired>
              <FormLabel>Type d&apos;utilisateur</FormLabel>
              <Select
                name="is_staff"
                value={formData.is_staff}
                onChange={handleChange}
                placeholder="Select user type"
              >
                <option value="0">Regular</option>
                <option value="1">Admin</option>
              </Select>
            </FormControl>

            <Button
              type="submit"
              bg={bgColor}
              color="white"
              _hover={{ bg: hoverColor }}
              width="100%"
            >
              créer
            </Button>
          </VStack>
        </form>
      </Box>
    </div>
  );
};

export default CreateUser;
