import {
  Flex,
  IconButton,
  useColorMode,
  Spacer,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Button,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Image from "next/image";
import logo from "../public/logo.png";
import { useState } from "react";
import Sidebar from "./main/Navbar";

const NonAuthNavbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Determine if the sidebar should be visible or a burger menu should be used
  const isSidebarVisible = useBreakpointValue({ base: false, md: true });

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding="1rem"
      boxShadow="sm"
      bg={colorMode === "light" ? "#C4DAD2" : "#6A9C89"}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Image src={logo} alt="Logo" height={50} />
      <>
        <IconButton
          aria-label="Open Menu"
          icon={<HamburgerIcon />}
          onClick={handleDrawerOpen}
          variant="ghost"
          display={{ base: "inline-flex", md: "none" }}
        />
        <Drawer
          isOpen={isDrawerOpen}
          placement="left"
          onClose={handleDrawerClose}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>
              <Flex justify="space-between" align="center">
                <Button variant="ghost" onClick={handleDrawerClose}>
                  <CloseIcon />
                </Button>
              </Flex>
            </DrawerHeader>
            <DrawerBody></DrawerBody>
          </DrawerContent>
        </Drawer>
      </>

      <Spacer />
      <IconButton
        aria-label="Toggle dark/light mode"
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        variant="ghost"
      />
    </Flex>
  );
};

export default NonAuthNavbar;
