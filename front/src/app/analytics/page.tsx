import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import Header from "../components/main/Header";
import Navbar from "../components/main/Navbar";
import { MainContent } from "../components/dashboard/MainContent";
import AnalyticsMain from "../components/analytics/AnalyticsMain";

const Page = () => {
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
      color="blackAlpha.700"
      fontWeight="bold"
    >
      <GridItem area={"header"}>
        <Header />
      </GridItem>
      <GridItem
        bg="green.700"
        area={"nav"}
        display={{ base: "none", md: "block" }}
      >
        <Navbar />
      </GridItem>
      <GridItem pl="2" bg="green.700" area={"main"}>
        <AnalyticsMain />
      </GridItem>
    </Grid>
  );
};

export default Page;
