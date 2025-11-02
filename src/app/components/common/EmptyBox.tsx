import { Box, Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";

const EmptyBox = ({ text = "Pas de données" }: { text?: string }) => {
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
      <Text>{text}</Text>
    </Box>
  );
};

export default EmptyBox;
