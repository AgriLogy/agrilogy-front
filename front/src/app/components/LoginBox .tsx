import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputLeftElement,
	IconButton,
	Stack,
	Text,
	useColorModeValue, // Import useColorModeValue
  } from "@chakra-ui/react";
  import { EmailIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
  import { useState } from "react";
  
  const LoginBox = () => {
	const [showPassword, setShowPassword] = useState(false);
  
	const handlePasswordVisibility = () => setShowPassword(!showPassword);
  
	// Define colors for light and dark mode
	const boxBg = useColorModeValue("white", "gray.700");
	const inputBg = useColorModeValue("gray.100", "gray.600");
	const inputBorderColor = useColorModeValue("gray.300", "gray.500");
	const textColor = useColorModeValue("gray.800", "white");
  
	return (
	  <Box
		maxWidth="500px"
		width="100%"
		borderTopLeftRadius={45}
		borderBottomRightRadius={45}
		padding="10"
		boxShadow="lg"
		bg={boxBg} // Dynamic background based on mode
		position="relative"
		_before={{
		  content: `""`,
		  position: "absolute",
		  top: "-20px",
		  left: "50%",
		  transform: "translateX(-50%)",
		  backgroundImage: "url('/leaf.png')",
		  width: "60px",
		  height: "60px",
		  backgroundSize: "cover",
		  zIndex: 1,
		}}
	  >
		<Text
		  fontSize="2xl"
		  fontWeight="bold"
		  mb="4"
		  textAlign="center"
		  color={textColor} // Dynamic text color
		>
		  Se connecter
		</Text>
		<Stack spacing={4}>
		  <FormControl id="username">
			<FormLabel color={textColor}>Nom d'utilisateur</FormLabel>
			<InputGroup>
			  <InputLeftElement pointerEvents="none">
				<EmailIcon color="gray.300" />
			  </InputLeftElement>
			  <Input
				type="text"
				placeholder="Votre nom d'utilisateur"
				bg={inputBg} // Dynamic input background
				borderColor={inputBorderColor} // Dynamic input border color
				_placeholder={{ color: useColorModeValue("gray.500", "gray.400") }}
			  />
			</InputGroup>
		  </FormControl>
  
		  <FormControl id="password">
			<FormLabel color={textColor}>Mot de passe</FormLabel>
			<InputGroup>
			  <InputLeftElement>
				<IconButton
				  aria-label="Toggle password visibility"
				  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
				  variant="ghost"
				  onClick={handlePasswordVisibility}
				/>
			  </InputLeftElement>
			  <Input
				type={showPassword ? "text" : "password"}
				placeholder="Votre mot de passe"
				bg={inputBg} // Dynamic input background
				borderColor={inputBorderColor} // Dynamic input border color
				_placeholder={{ color: useColorModeValue("gray.500", "gray.400") }}
			  />
			</InputGroup>
		  </FormControl>
  
		  <Button variant="link" colorScheme="teal" textAlign="left">
			Mot de passe oublié ?
		  </Button>
  
		  <Button colorScheme="teal" size="lg" width="100%">
			Se connecter
		  </Button>
		</Stack>
	  </Box>
	);
  };
  
  export default LoginBox;
  