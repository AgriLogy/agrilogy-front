import React from "react";
import { Box, Text, Grid, GridItem, Icon, Link } from "@chakra-ui/react";
import { FaTachometerAlt, FaUsers, FaSignOutAlt, FaMapMarkedAlt } from "react-icons/fa";
import useColorModeStyles from "@/app/utils/useColorModeStyles";

const MainAdmin = () => {
  const { bg, textColor, hoverColor } = useColorModeStyles();

  return (
	
    <Grid templateColumns="repeat(2, 1fr)" gap={6} p={6}>
      <GridItem>
        <Link
          href={`/admin/dashboard`}
          color={hoverColor}
          textDecoration="non"
        >
          <Box
            bg={bg}
            border="1px solid #ccc"
            borderRadius="5px"
            height="200px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            _hover={{ bg: hoverColor }}
          >
            <Icon as={FaTachometerAlt} boxSize={8} color={textColor} />
            <Text mt={2} color={textColor}>
              Dashboard
            </Text>
          </Box>
        </Link>
      </GridItem>

      <GridItem>
        <Link
          href={`/admin/users/liste`}
          color={hoverColor}
          textDecoration="non"
        >
          <Box
            bg={bg}
            border="1px solid #ccc"
            borderRadius="5px"
            height="200px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            _hover={{ bg: hoverColor }}
          >
            <Icon as={FaUsers} boxSize={8} color={textColor} />
            <Text mt={2} color={textColor}>
              Utilisateurs
            </Text>
          </Box>
        </Link>
      </GridItem>

      <GridItem>
        <Link
          href={`/admin/zones/liste`}
          color={hoverColor}
          textDecoration="non"
        >
          <Box
            bg={bg}
            border="1px solid #ccc"
            borderRadius="5px"
            height="200px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            _hover={{ bg: hoverColor }}
          >
            <Icon as={FaMapMarkedAlt} boxSize={8} color={textColor} />
            <Text mt={2} color={textColor}>
              Zones
            </Text>
          </Box>
        </Link>
      </GridItem>

      <GridItem>
        <Link href={`/login`} color={hoverColor} textDecoration="non">
          <Box
            bg={bg}
            border="1px solid #ccc"
            borderRadius="5px"
            height="200px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            _hover={{ bg: hoverColor }}
          >
            <Icon as={FaSignOutAlt} boxSize={8} color={textColor} />
            <Text mt={2} color={textColor}>
              Déconnexion
            </Text>
          </Box>
        </Link>
      </GridItem>
    </Grid>
  );
};

export default MainAdmin;
