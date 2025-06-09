'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import LanguageSwitcher, { t } from '@/components/LanguageSwitcher';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormControl,
  FormLabel,
  Text,
  Flex,
  Box,
  Heading,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast
} from '@chakra-ui/react';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { getGoogleAuthUrl, fetchUserData } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, forceUpdate] = useState({});

  // Hata mesajını kontrol edin
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  // Dil değişikliğini izlemek için
  useEffect(() => {
    const handleStorageChange = () => {
      forceUpdate({});
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Attempting login with:", { email, password });
      
      // Login işlemi
      const response = await api.post('/auth-service/api/v1/auth/login', {
        email,
        password
      });
      
      console.log("Login successful:", response.data);
      
      // Başarılı login sonrası yönlendirme
      toast({
        title: t('common.success'),
        description: t('login.loginSuccessful'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Kullanıcı bilgilerini güncelle
      await fetchUserData();
      
      // Dashboard'a yönlendir
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Hata mesajını göster
      const errorMessage = error.response?.data?.message || t('common.unexpectedError');
      setError(errorMessage);
      
      toast({
        title: t('common.error'),
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setError(null); // Önceki hataları temizle
      const authUrl = await getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (error: any) {
      console.error('Google login error:', error);
      setError(error.message || 'Failed to get Google auth URL');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Flex minHeight="90vh" width="100%" direction={{ base: 'column', md: 'row' }}>
      {/* Language Switcher */}
      <Box position="absolute" top={4} right={4} zIndex={10}>
        <LanguageSwitcher />
      </Box>
      
      {/* Left side - Image/Branding */}
      <Box
        display={{ base: 'none', md: 'flex' }}
        width={{ md: '45%' }}
        bg="blue.600"
        color="white"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={8}
      >
        <Heading as="h1" size="lg" mb={4}>{t('branding.title')}</Heading>
        <Text fontSize="md" mb={6}>
          {t('branding.loginDescription')}
        </Text>
      </Box>

      {/* Right side - Login Form */}
      <Flex flex="1" alignItems="center" justifyContent="center" p={4} bg="gray.50">
        <Card width="100%" maxWidth="md" boxShadow="lg" borderWidth="0">
          <CardHeader pb={2}>
            <Heading as="h2" size="md" textAlign="center">{t('common.login')}</Heading>
            <Text textAlign="center" color="gray.500" mt={1} fontSize="sm">
              {t('login.subtitle')}
            </Text>
            
            {/* Hata mesajını göster */}
            {error && (
              <Box mt={3} p={2} bg="red.50" borderRadius="md">
                <Text color="red.500" fontSize="sm" textAlign="center">
                  {error}
                </Text>
              </Box>
            )}
          </CardHeader>
          
          <CardBody pt={2}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <FormControl>
                  <FormLabel htmlFor="email" fontSize="sm">{t('common.email')}</FormLabel>
                  <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <FaEnvelope />
                    </InputLeftElement>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <Flex alignItems="center" justifyContent="space-between">
                    <FormLabel htmlFor="password" mb={0} fontSize="sm">{t('common.password')}</FormLabel>
                    <Link href="/forgot-password">
                      <Text fontSize="xs" color="blue.600" fontWeight="medium" _hover={{ color: "blue.800" }}>
                        {t('common.forgotPassword')}
                      </Text>
                    </Link>
                  </Flex>
                  <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <FaLock />
                    </InputLeftElement>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </InputGroup>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="sm"
                  width="full"
                  isLoading={isLoading}
                  loadingText={t('common.signingIn')}
                  mt={1}
                >
                  {t('common.signIn')}
                </Button>
              </Stack>
            </form>
            
            <Box position="relative" my={4}>
              <hr />
              <Text position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" bg="white" px={2} color="gray.500" fontSize="xs">
                {t('common.or')} {t('common.continueWith')}
              </Text>
            </Box>
            
            <Button
              variant="outline"
              width="full"
              leftIcon={<FaGoogle color="#DB4437" />}
              borderColor="gray.300"
              color="gray.700"
              _hover={{ bg: "gray.50" }}
              size="sm"
              onClick={handleGoogleLogin}
              isLoading={googleLoading}
              loadingText={t('common.connecting')}
            >
              Google
            </Button>
          </CardBody>
          
          <CardFooter justifyContent="center" borderTopWidth="1px" borderColor="gray.100" pt={3} pb={3}>
            <Text fontSize="sm" color="gray.600">
              {t('common.dontHaveAccount')}{' '}
              <Link href="/signup">
                <Text as="span" color="blue.600" fontWeight="medium" _hover={{ color: "blue.800" }}>
                  {t('common.signUp')}
                </Text>
              </Link>
            </Text>
          </CardFooter>
        </Card>
      </Flex>
    </Flex>
  );
}
