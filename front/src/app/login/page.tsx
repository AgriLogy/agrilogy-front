"use client";
import { Flex, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from 'next/router';
import NonAuthNavbar from "../components/NonAuthNavbar ";
import LoginBox from "../components/LoginBox ";

const LoginPage = () => {
  const bgGradient = useColorModeValue(
    "linear(to-b, #C4DAD2, green.200)",
    "linear(to-b, #6A9C89, gray.700)"
  );
  
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/');
  };

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
        <LoginBox onSuccess={handleLoginSuccess} />
      </Flex>
    </>
  );
};

export default LoginPage;
