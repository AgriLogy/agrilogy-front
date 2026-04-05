'use client';
import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import Header from '../../components/main/Header';
import Sidebar from '../../components/main/Sidebar';
import useColorModeStyles from '../../utils/useColorModeStyles';

const Page = () => {
  const { textColor, navBgColor, SideBarbg } = useColorModeStyles();

  return (
    <Grid
      templateAreas={{
        base: `"header"
               "main"`,
        md: `"header header"
             "nav main"`,
      }}
      gridTemplateRows={{ base: 'auto 1fr', md: '64px 1fr' }}
      gridTemplateColumns={{ base: '1fr', md: '72px 1fr' }}
      height="100vh"
      gap="0.5"
      color={textColor}
      fontWeight="bold"
    >
      <GridItem area={'header'}>
        <Header />
      </GridItem>
      <GridItem
        bg={SideBarbg}
        area={'nav'}
        display={{ base: 'none', md: 'block' }}
      >
        <Sidebar />
      </GridItem>
      <GridItem pl="2" bg={navBgColor} area={'main'}>
        {/* <AlertMain /> */}
        {/* <WindSpeedMain /> */}
        AlersMain
      </GridItem>
    </Grid>
  );
};

export default Page;
