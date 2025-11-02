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
  HStack,
  Spinner,
} from "@chakra-ui/react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import axiosInstance from "@/app/lib/api";
import "@/app/styles/graphes.css";

type Props = {
  user: string;
};

const ModifyUser = ({ user }: Props) => {
  const toast = useToast();
  const { bg, textColor, hoverColor } = useColorModeStyles();

  const [formData, setFormData] = useState({
    username: user,
    firstname: "",
    lastname: "",
    email: "",
    phone_number: "",
    is_staff: "",
    latitude: "",
    longitude: "",
  });

  const [loadingLocation, setLoadingLocation] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(
          `/auth/modify-user/?username=${user}`
        );
        if (response.status === 200) {
          setFormData((prev) => ({
            ...prev,
            ...response.data,
            latitude: response.data.latitude ?? "",
            longitude: response.data.longitude ?? "",
          }));
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

  const handleFillLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
        setLoadingLocation(false);
        toast({
          title: "Success",
          description: "Location filled successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      (error) => {
        setLoadingLocation(false);
        toast({
          title: "Error",
          description: "Failed to get location. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Geolocation error:", error);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put("/auth/modify-user/", formData);

      if (response.status === 200) {
        toast({
          title: "Success!",
          description:
            "Les données utilisateur ont été mises à jour avec succès.",
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
              <FormLabel>Nom d&apos;utilisateur</FormLabel>
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

            {/* New Latitude and Longitude fields */}
            <FormControl id="latitude">
              <FormLabel>Latitude</FormLabel>
              <Input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Enter latitude"
              />
            </FormControl>

            <FormControl id="longitude">
              <FormLabel>Longitude</FormLabel>
              <Input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Enter longitude"
              />
            </FormControl>

            <HStack width="100%" justify="flex-end" spacing={3}>
              <Button
                onClick={handleFillLocation}
                colorScheme="teal"
                isLoading={loadingLocation}
                loadingText="Fetching location"
                size="sm"
              >
                Remplir la position automatiquement
              </Button>
            </HStack>

            <Button
              type="submit"
              // bg={bgColor}
              colorScheme="blue"
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
