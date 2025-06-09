
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
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
  List,
  ListItem,
  ListIcon,
  useToast
} from '@chakra-ui/react';
import { FaEnvelope, FaLock, FaUser, FaGoogle, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';

export default function SignupPage() {
  const router = useRouter();
  const toast = useToast();
  const { getGoogleAuthUrl, fetchUserData } = useAuth();
  const { t } = useLanguage(); // useLanguage hook'undan t fonksiyonunu alalım
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Şifre doğrulama
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  
  // Şifre değiştiğinde doğrulama yap
  useEffect(() => {
    setPasswordValid({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    });
  }, [password]);
  
  // Şifre yeterince güçlü mü?
  const isPasswordStrong = Object.values(passwordValid).filter(Boolean).length >= 4;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Şifre yeterince güçlü değilse uyarı göster
    if (!isPasswordStrong) {
      toast({
        title: t('common.error'),
        description: t('signup.weakPassword'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Attempting signup with:", { name, email, password });
      
      // Kayıt işlemi
      const response = await api.post('/auth-service/api/v1/auth/register', {
        name,
        email,
        password
      });
      
      console.log("Signup successful:", response.data);
      
      // Başarılı kayıt sonrası yönlendirme
      toast({
        title: t('common.success'),
        description: t('signup.signupSuccessful'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Kullanıcı bilgilerini güncelle
      await fetchUserData();
      
      // Dashboard'a yönlendir
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Hata mesajını göster
      const errorMessage = error.response?.data?.message || t('common.unexpectedError');
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

  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);
      const authUrl = await getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Google signup error:', error);
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
          {t('branding.signupDescription')}
        </Text>
      </Box>

      {/* Right side - Signup Form */}
      <Flex flex="1" alignItems="center" justifyContent="center" p={4} bg="gray.50">
        <Card width="100%" maxWidth="md" boxShadow="lg" borderWidth="0">
          <CardHeader pb={2}>
            <Heading as="h2" size="md" textAlign="center">{t('common.createAccount')}</Heading>
            <Text textAlign="center" color="gray.500" mt={1} fontSize="sm">
              {t('signup.subtitle')}
            </Text>
          </CardHeader>
          
          <CardBody pt={2}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <FormControl>
                  <FormLabel htmlFor="name" fontSize="sm">{t('common.name')}</FormLabel>
                  <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <FaUser />
                    </InputLeftElement>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </InputGroup>
                </FormControl>
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
                      required
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password" fontSize="sm">{t('common.password')}</FormLabel>
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
                
                {/* Password requirements */}
                <Box bg="gray.50" p={2} borderRadius="md" fontSize="xs">
                  <Text fontWeight="medium" mb={1}>{t('signup.passwordRequirements')}</Text>
                  <List spacing={1}>
                    <ListItem>
                      <ListIcon as={hasMinLength ? FaCheck : FaTimes} color={hasMinLength ? "green.500" : "red.500"} />
                      {t('signup.minChars')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={hasUpperCase ? FaCheck : FaTimes} color={hasUpperCase ? "green.500" : "red.500"} />
                      {t('signup.upperCase')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={hasNumber ? FaCheck : FaTimes} color={hasNumber ? "green.500" : "red.500"} />
                      {t('signup.number')}
                    </ListItem>
                    <ListItem>
                      <ListIcon as={hasSpecialChar ? FaCheck : FaTimes} color={hasSpecialChar ? "green.500" : "red.500"} />
                      {t('signup.specialChar')}
                    </ListItem>
                  </List>
                </Box>
                
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="sm"
                  width="full"
                  isLoading={isLoading}
                  loadingText={t('common.creatingAccount')}
                  mt={1}
                >
                  {t('common.createAccount')}
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
              onClick={handleGoogleSignup}
              isLoading={googleLoading}
              loadingText={t('common.connecting')}
            >
              Google
            </Button>
          </CardBody>
          
          <CardFooter justifyContent="center" borderTopWidth="1px" borderColor="gray.100" pt={3} pb={3}>
            <Text fontSize="sm" color="gray.600">
              {t('common.alreadyHaveAccount')}{' '}
              <Link href="/login">
                <Text as="span" color="blue.600" fontWeight="medium" _hover={{ color: "blue.800" }}>
                  {t('common.signIn')}
                </Text>
              </Link>
            </Text>
          </CardFooter>
        </Card>
      </Flex>
    </Flex>
  );
}
