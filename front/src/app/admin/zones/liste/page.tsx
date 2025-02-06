"use client";
import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import HeaderAdmin from "@/app/components/main/HeaderAdmin";
import AdminSidebar from "@/app/components/main/AdminSidebar";
import ListeZones from "@/app/components/admin/ListeZones";

const Page = () => {
  const { bg, textColor, navBgColor } = useColorModeStyles();

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
      <GridItem area={"header"} bg={navBgColor}>
        <HeaderAdmin />
      </GridItem>
      <GridItem
        bg={navBgColor}
        area={"nav"}
        display={{ base: "none", md: "block" }}
      >
        <AdminSidebar />
      </GridItem>
      <GridItem
        pl="2"
        bg={navBgColor}
        area={"main"}
        overflowY="auto"
        height="100%"
      >
        <ListeZones />
      </GridItem>
    </Grid>
  );
};

export default Page;
