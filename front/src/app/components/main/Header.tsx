import React from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import MobileMenu from "./MobileMenu";
import BigMenu from "./BigMenu";

const Header = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return <div>{isMobile ? <MobileMenu /> : <BigMenu />}</div>;
};

export default Header;
