"use client";
import { Flex, useColorModeValue } from "@chakra-ui/react";
import NonAuthNavbar from "@/app/components/NonAuthNavbar ";
import AdminLoginBox from "@/app/components/admin/AdminLoginBox";

const LoginPage = () => {
  const bgGradient = useColorModeValue(
    "linear(to-b, #C4DAD2, green.200)",
    "linear(to-b, #6A9C89, gray.700)"
  );

  return (
    <>
      <NonAuthNavbar />
      <Flex
        align="center"
        justify="center"
        height="calc(100vh - 82px)"
        px={{ base: 4, md: 0 }}
        bgGradient={bgGradient}
      >
        <AdminLoginBox />
      </Flex>
    </>
  );
};

export default LoginPage;
