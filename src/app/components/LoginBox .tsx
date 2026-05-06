'use client';

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
  useColorModeValue,
} from '@chakra-ui/react';
import { EmailIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import axiosInstance from '../lib/api';
import { useRouter } from 'next/navigation'; // Importing useRouter from next/navigation

const LoginBox = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const boxBg = useColorModeValue('white', 'gray.700');
  const inputBg = useColorModeValue('gray.100', 'gray.600');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.500');
  const textColor = useColorModeValue('gray.800', 'white');
  const router = useRouter(); // Use Next.js router for redirection

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true when submitting
    try {
      const response = await axiosInstance.post('/auth/signin/', {
        username,
        password,
      });

      if (response.status >= 200 && response.status < 300) {
        const { access, refresh, is_staff } = response.data;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        is_staff ? router.push('/admin') : router.push('/');
      }
    } catch {
      setErrorMessage("Nom d'utilisateur ou mot de passe incorrect.");
      // Clear error message after 5 seconds
    } finally {
      setTimeout(() => {
        setErrorMessage(''); // Clear error message after 5 seconds
      }, 10000);
      setLoading(false); // Set loading to false after the request is done
    }
  };

  return (
    <Box
      maxWidth="500px"
      width="100%"
      borderTopLeftRadius={45}
      borderBottomRightRadius={45}
      padding="10"
      boxShadow="lg"
      bg={boxBg}
      position="relative"
      _before={{
        content: `""`,
        position: 'absolute',
        top: '-20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60px',
        height: '60px',
        backgroundSize: 'cover',
        zIndex: 1,
      }}
    >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        mb="4"
        textAlign="center"
        color={textColor}
      >
        Se connecter
      </Text>

      {errorMessage && (
        <Text color="red.500" textAlign="center" mb="4">
          {errorMessage}
        </Text>
      )}

      <Stack spacing={4}>
        <FormControl id="username">
          <FormLabel color={textColor}>Nom d&apos;utilisateur</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <EmailIcon color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Votre nom d'utilisateur"
              bg={inputBg}
              borderColor={inputBorderColor}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              _placeholder={{
                color: useColorModeValue('gray.500', 'gray.400'),
              }}
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
              type={showPassword ? 'text' : 'password'}
              placeholder="Votre mot de passe"
              bg={inputBg}
              borderColor={inputBorderColor}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              _placeholder={{
                color: useColorModeValue('gray.500', 'gray.400'),
              }}
            />
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="teal"
          size="lg"
          width="100%"
          onClick={handleSubmit}
          isLoading={loading} // Show spinner when loading
          loadingText="Connexion..."
        >
          Se connecter
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginBox;
