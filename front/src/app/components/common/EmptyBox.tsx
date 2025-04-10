import { Box, Spinner, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";

const EmptyBox = () => {
  const chartBg = useColorModeValue("white", "gray.800");
  const p = useBreakpointValue({ base: 2, md: 4 });

  return (
    <Box
      width="100%"
      height="100%"
      bg={chartBg}
      borderRadius="md"
      boxShadow="lg"
      p={p}
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner size="xl" color="green.500" />
    </Box>
  );
};

export default EmptyBox;
