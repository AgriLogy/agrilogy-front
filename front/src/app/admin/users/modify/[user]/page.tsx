"use client";
import React, { useEffect, useState } from "react";
import useColorModeStyles from "@/app/utils/useColorModeStyles";
import { Grid, GridItem } from "@chakra-ui/react";
import ModifyUser from "@/app/components/admin/ModifyUser";
import HeaderAdmin from "@/app/components/main/HeaderAdmin";
import AdminSidebar from "@/app/components/main/AdminSidebar";
type Params = {
  user: string;
};

const ModifyUserpage = ({ params }: { params: Params }) => {
  const { textColor, navBgColor } = useColorModeStyles();
  const { user } = params;

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
        <ModifyUser user={user} />
      </GridItem>
    </Grid>
  );
};

export default ModifyUserpage;
