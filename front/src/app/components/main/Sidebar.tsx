"use client";
import React from "react";
import { Flex, IconButton, Box, Tooltip, Link } from "@chakra-ui/react";
import { FaHome, FaChartLine, FaLeaf, FaCog } from "react-icons/fa";
import { PiSigmaBold } from "react-icons/pi";
import useColorModeStyles from "@/app/utils/useColorModeStyles";

const Sidebar = () => {
  const { bg, hoverColor } = useColorModeStyles(); // Get styles from the utility

  return (
    <Flex
      direction="column"
      align="center"
      bg={bg}
      p={4}
      width="100%"
      height="100%"
    >
      {/* Home Icon */}
      <Tooltip label="Dashboard" aria-label="Home">
        <Link href="/dashboard">
          <IconButton
            icon={<FaHome />}
            aria-label="Home"
            variant="ghost"
            mb={2}
            _hover={{ color: hoverColor }}
          />
        </Link>
      </Tooltip>

      {/* Delimiter */}
      <Box height="1px" width="20px" bg="gray.400" mb={2} />

      {/* Analytics Icon */}
      <Tooltip label="analytique" aria-label="Analytics">
        <Link href="/analytics">
          <IconButton
            icon={<FaChartLine />}
            aria-label="Analytics"
            variant="ghost"
            mb={2}
            _hover={{ color: hoverColor }}
          />
        </Link>
      </Tooltip>

      {/* Delimiter */}
      <Box height="1px" width="20px" bg="gray.400" mb={2} />

      {/* Sigma Icon */}
      <Tooltip label="Station météo" aria-label="Sigma">
        <Link href="/station">
          <IconButton
            icon={<PiSigmaBold />}
            aria-label="Sigma"
            variant="ghost"
            mb={2}
            _hover={{ color: hoverColor }}
          />
        </Link>
      </Tooltip>

      {/* Delimiter */}
      <Box height="1px" width="20px" bg="gray.400" mb={2} />

      {/* Soil Moisture Icon */}
      <Tooltip label="Humidité du sol" aria-label="Soil Moisture">
        <Link href="/moisture">
          <IconButton
            icon={<FaLeaf />}
            aria-label="Soil Moisture"
            variant="ghost"
            mb={2}
            _hover={{ color: hoverColor }}
          />
        </Link>
      </Tooltip>

      {/* Delimiter */}
      <Box height="1px" width="20px" bg="gray.400" mb={2} />

      {/* Settings Icon */}
      <Tooltip label="Paramètres" aria-label="Settings">
        <Link href="/settings">
          <IconButton
            icon={<FaCog />}
            aria-label="Settings"
            variant="ghost"
            _hover={{ color: hoverColor }}
          />
        </Link>
      </Tooltip>
    </Flex>
  );
};

export default Sidebar;
