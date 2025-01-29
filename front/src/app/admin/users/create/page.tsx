"use client";
import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import Header from "../../../components/main/Header";
import Sidebar from "../../../components/main/Sidebar";
import { MainContent } from "../../../components/dashboard/MainContent";
import useColorModeStyles from "@/app/utils/useColorModeStyles";

import NotificationsMain from "../../../components/notifications/NotificationsMain";
import CreateUser from "@/app/components/admin/CreateUser";
import HeaderAdmin from "@/app/components/main/HeaderAdmin";
import AdminSidebar from "@/app/components/main/AdminSidebar";

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
      <GridItem pl="2" bg={navBgColor} area={"main"} overflowY="auto" height="100%">
        {/* <CreateUser /> */}
        <CreateUser/>
      </GridItem>
    </Grid>
  );
};

export default Page;
