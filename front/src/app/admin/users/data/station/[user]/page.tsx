"use client";
import React, { useEffect, useState } from "react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import { Grid, GridItem } from "@chakra-ui/react";
import HeaderAdmin from "@/app/components/main/HeaderAdmin";
import AdminSidebar from "@/app/components/main/AdminSidebar";
import UserStationdata from "@/app/components/admin/UserStationdata";
type Params = {
  user: string;
};

const StationDatapage = ({ params }: { params: Params }) => {
  const { user } = params;
  const { textColor, navBgColor } = useColorModeStyles();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
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
        <UserStationdata user={user} />
      </GridItem>
    </Grid>
  );
};

export default StationDatapage;
