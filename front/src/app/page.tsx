"use client";
import { Grid, GridItem } from "@chakra-ui/react";
import React,  { useEffect } from "react";
import Header from "./components/main/Header";
import Navbar from "./components/main/Sidebar";
import useColorModeStyles from "./utils/useColorModeStyles";
import { useRouter } from "next/navigation";
import { checkAuthTokens } from "./lib/checkAuthTokens";
import MainContent from "./components/dashboard/MainContent";



const Page = () => {
  const { textColor, navBgColor } = useColorModeStyles();
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = checkAuthTokens();
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router]);
  return (
    <Grid
      templateAreas={{
        base: `"header"
               "main"`,
        md: `"header header"
             "nav main"`,
      }}
      gridTemplateRows={{ base: "auto 1fr", md: "50px 1fr" }}
      gridTemplateColumns={{ base: "1fr", md: "50px 1fr" }}
      height="100vh"
      gap="0.5"
      color={textColor}
      fontWeight="bold"
    >
      <GridItem area={"header"}>
        <Header />
      </GridItem>
      <GridItem
        bg={navBgColor}
        area={"nav"}
        display={{ base: "none", md: "block" }}
      >
        <Navbar />
      </GridItem>
      {/* <GridItem pl="2" bg={navBgColor} area={"main"}>
        <MainContent />
      </GridItem> */}
      <GridItem
        pl="2" bg={navBgColor} area={"main"} overflowY="auto" height="100%" >
        <MainContent />
      </GridItem>
    </Grid>
  );
};

export default Page;
