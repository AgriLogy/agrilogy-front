import React, { ReactNode } from "react";
import {
  Box,
  Text,
  useColorModeValue,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";

interface DashboardCardProps {
  title: string;
  content: ReactNode;
  maxHeight?: string; // Optional: Max height for card
}

const DashboardCard = ({ title, content }: DashboardCardProps) => {
  const tableBg = useColorModeValue("white", "gray.800");
  const { colorMode } = useColorMode();

  // Responsive height for scrollable content area
  const scrollableHeight = useBreakpointValue({
    base: "500px",
    md: "calc(100% - 30px)", // Subtract the title height from full height
  });

  return (
    <Box
      width="100%"
      height="100%"
      bg={tableBg}
      borderRadius="md"
      // boxShadow="lg"
      overflow="hidden"
    >
      {/* Title of the card */}
      <Text
        color={colorMode === "light" ? "gray.700" : "gray.200"}
        fontSize="lg"
        fontWeight="bold"
        mb={2}
      >
        {title}
      </Text>

      {/* Scrollable content area */}
      <Box
        width="100%"
        height={scrollableHeight} // Make it responsive
        overflowY="auto"          // Enable scrolling
        pb={2}
        pr={2}                     // Padding for the content area
      >
        {content}  {/* Dynamic content */}
      </Box>
    </Box>
  );
};

export default DashboardCard;
