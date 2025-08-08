import React, { useEffect, useState } from "react";
import {
  VStack,
  Text,
  Box,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import ElectrovanCard, { Electrovanne } from "./ElectrovanCard";
import { electrovanneList } from "@/app/data/dashboard/electrovannes";
import Loading from "../common/Loading";

const ElectrovannesList = () => {
  const tableBg = useColorModeValue("white", "gray.800");
  const [loading, setLoading] = useState(true);

  const { colorMode } = useColorMode();

  useEffect(() => {
    setLoading(false);
  }, [loading]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Box
      width="100%"
      height="100%"
      bg={tableBg}
      borderRadius="md"
      boxShadow="lg"
      // p={p}
      overflowX="auto"
    >
      <Text
        color={colorMode === "light" ? "gray.700" : "gray.200"}
        fontSize="lg"
        fontWeight="bold"
        mb={4}
      >
        Electrovannes disponibles
      </Text>
      <VStack spacing={4} align="stretch">
        {electrovanneList.map((vanne: Electrovanne) => (
          <ElectrovanCard key={vanne.id} electrovanne={vanne} />
        ))}
      </VStack>
    </Box>
  );
};

export default ElectrovannesList;
