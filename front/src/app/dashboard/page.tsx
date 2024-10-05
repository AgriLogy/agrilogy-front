"use client"
import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import Header from "../components/main/Header";
import Navbar from "../components/main/Navbar";
import { MainContent } from "../components/dashboard/MainContent";
import useColorModeStyles from "../utils/useColorModeStyles";

const Page = () => {
  const { bg, textColor, navBgColor } = useColorModeStyles(); // Use your utility

  return (
    <Grid
      templateAreas={{
        base: `"header"
               "main"`, // For small screens (base)
        md: `"header header"
             "nav main"`, // For medium and larger screens
      }}
      gridTemplateRows={{ base: "auto 1fr", md: "50px 1fr" }}
      gridTemplateColumns={{ base: "1fr", md: "50px 1fr" }}
      height="100vh"
      gap="0.5"
      color={textColor} // Use the text color from your utility
      fontWeight="bold"
    >
      <GridItem area={"header"}>
        <Header />
      </GridItem>
      <GridItem
        bg={navBgColor} // Use the background color from your utility
        area={"nav"}
        display={{ base: "none", md: "block" }}
      >
        <Navbar />
      </GridItem>
      <GridItem pl="2" bg={navBgColor} area={"main"}>
        <MainContent />
      </GridItem>
    </Grid>
  );
};

export default Page;
