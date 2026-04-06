'use client';

import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import Header from '@/app/components/main/Header';
import Navbar from '@/app/components/main/Sidebar';
import VannesPompesSchemaMain from '@/app/components/vannes-pompes/VannesPompesSchemaMain';
import useColorModeStyles from '@/app/utils/useColorModeStyles';

const Page = () => {
  const { navBgColor, textColor } = useColorModeStyles();

  return (
    <Grid
      templateAreas={{
        base: `"header"
               "main"`,
        md: `"header header"
             "nav main"`,
      }}
      gridTemplateRows={{ base: 'auto 1fr', md: '50px 1fr' }}
      gridTemplateColumns={{ base: '1fr', md: '50px 1fr' }}
      height="100vh"
      gap="0.5"
      color={textColor}
      fontWeight="bold"
    >
      <GridItem area="header">
        <Header />
      </GridItem>
      <GridItem
        bg={navBgColor}
        area="nav"
        display={{ base: 'none', md: 'block' }}
      >
        <Navbar />
      </GridItem>
      <GridItem
        pl="2"
        bg={navBgColor}
        area="main"
        overflowY="auto"
        height="100%"
      >
        <VannesPompesSchemaMain />
      </GridItem>
    </Grid>
  );
};

export default Page;
