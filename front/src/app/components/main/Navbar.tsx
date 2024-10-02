"use client";
import React from "react";
import { Flex, IconButton, useColorMode, Box, Tooltip, Link } from "@chakra-ui/react";
import { FaHome, FaChartLine, FaLeaf, FaCog } from "react-icons/fa";
import { PiSigmaBold } from "react-icons/pi";

const Sidebar = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      direction="column"
      align="center"
      bg={colorMode === "light" ? "gray.200" : "gray.800"}
      p={4}
      width="100%"
      height="100%" // Add this line to make it full height
      // borderBottomRightRadius='10'
    >
      {/* Home Icon */}
      <Tooltip label="Home" aria-label="Home">
      <Link href="/dashboard">
        <IconButton
          icon={<FaHome />}
          aria-label="Home"
          variant="ghost"
          mb={2}
          _hover={{ color: colorMode === "light" ? "blue.500" : "blue.300" }}
          />
        </Link>
      </Tooltip>

      {/* Delimiter */}
      <Box height="1px" width="20px" bg="gray.400" mb={2} />

      {/* Analytics Icon */}
      <Tooltip label="Analytics" aria-label="Analytics">
      <Link href="/analytics">
        <IconButton
          icon={<FaChartLine />}
          aria-label="Analytics"
          variant="ghost"
          mb={2}
          _hover={{ color: colorMode === "light" ? "blue.500" : "blue.300" }}
          />
          </Link>
      </Tooltip>

      {/* Delimiter */}
      <Box height="1px" width="20px" bg="gray.400" mb={2} />

      {/* Sigma Icon */}
      <Tooltip label="Sigma" aria-label="Sigma">
        <IconButton
          icon={<PiSigmaBold />}
          aria-label="Sigma"
          variant="ghost"
          mb={2}
          _hover={{ color: colorMode === "light" ? "blue.500" : "blue.300" }}
        />
      </Tooltip>

      {/* Delimiter */}
      <Box height="1px" width="20px" bg="gray.400" mb={2} />

      {/* Soil Moisture Icon */}
      <Tooltip label="Soil Moisture" aria-label="Soil Moisture">
        <IconButton
          icon={<FaLeaf />}
          aria-label="Soil Moisture"
          variant="ghost"
          mb={2}
          _hover={{ color: colorMode === "light" ? "blue.500" : "blue.300" }}
        />
      </Tooltip>

      {/* Delimiter */}
      <Box height="1px" width="20px" bg="gray.400" mb={2} />

      {/* Settings Icon */}
      <Tooltip label="Settings" aria-label="Settings">
        <IconButton
          icon={<FaCog />}
          aria-label="Settings"
          variant="ghost"
          _hover={{ color: colorMode === "light" ? "blue.500" : "blue.300" }}
        />
      </Tooltip>
    </Flex>
  );
};


export default Sidebar;
