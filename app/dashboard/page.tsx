'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';
import {
  Box,
  Flex,
  Heading,
  Text,
  Container,
  VStack,
  HStack,
  Avatar,
  Spinner,
  Button,
  useToast
} from '@chakra-ui/react';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading, fetchUserData, logout } = useAuth();
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const toast = useToast();

  // Token'ı alma fonksiyonu
  const getToken = () => {
    // Önce cookie'den kontrol et
    const cookieToken = Cookies.get('accessToken');
    if (cookieToken) {
      return cookieToken;
    }
    
    // Cookie'de yoksa localStorage'dan kontrol et
    return localStorage.getItem('accessToken');
  };

  // Kullanıcı bilgilerini güncelle
  useEffect(() => {
    const updateUserInfo = async () => {
      try {
        // Token kontrolü
        const token = getToken();
        if (!token) {
          console.log("No token found, redirecting to login");
          router.push('/login');
          return;
        }
        
        // Önce cookie'den kullanıcı bilgilerini kontrol et
        const userFromCookie = Cookies.get('user');
        if (userFromCookie) {
          try {
            // Cookie'den kullanıcı bilgilerini çöz
            const decodedCookie = decodeURIComponent(userFromCookie.replace(/\+/g, ' '));
            const userData = JSON.parse(decodedCookie);
            console.log("User data loaded from cookie:", userData);
            return;
          } catch (e) {
            console.error("Failed to parse user data from cookie:", e);
          }
        }
        
        console.log("Dashboard: Token found, fetching user data");
        await fetchUserData();
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Sadece kullanıcı bilgisi yoksa hata göster
        if (!user) {
          toast({
            title: "Hata",
            description: "Kullanıcı bilgileri alınamadı. Lütfen tekrar giriş yapın.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };
    
    updateUserInfo();
  }, [fetchUserData, router, toast, user]);

  // Hoş geldin mesajını güncelle
  useEffect(() => {
    if (user?.name) {
      console.log("Setting welcome message for user:", user.name);
      // URL decode işlemi yaparken + işaretlerini boşluğa çevir
      const decodedName = user.name.replace(/\+/g, ' ');
      setWelcomeMessage(`Hoş geldin, ${decodedName}!`);
    } else {
      console.log("No user name available for welcome message");
      setWelcomeMessage('Hoş geldiniz!');
    }
  }, [user]);

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const token = getToken();
      if (!token) {
        console.log("Redirecting to login: No authentication");
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  // Kullanıcı bilgilerini manuel olarak yenileme fonksiyonu
  const handleRefreshUserData = async () => {
    try {
      await fetchUserData();
      toast({
        title: "Başarılı",
        description: "Kullanıcı bilgileri yenilendi.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      console.log("User data refreshed");
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast({
        title: "Hata",
        description: "Kullanıcı bilgileri yenilenemedi.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Token bilgilerini görüntüleme
  const getTokenInfo = () => {
    const token = getToken();
    if (!token) return 'Yok';
    
    try {
      return JSON.stringify(JSON.parse(atob(token.split('.')[1])), null, 2);
    } catch (e) {
      return 'Token decode hatası';
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
        <Text ml={4}>Yükleniyor...</Text>
      </Flex>
    );
  }

  return (
    <Box minH="100vh">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="lg">Admin Panel</Heading>
              <Text color="gray.600">{welcomeMessage}</Text>
              <Text fontSize="sm" color="gray.500">
                {user ? `ID: ${user.id}` : 'Kullanıcı bilgisi yok'}
              </Text>
            </Box>
            <HStack>
              <Avatar 
                size="md" 
                name={user?.name || 'User'} 
                src={user?.imageUrl} 
              />
              <Box>
                <Text fontWeight="bold">
                  {user?.name ? user.name.replace(/\+/g, ' ') : 'İsimsiz Kullanıcı'}
                </Text>
                <Text fontSize="sm" color="gray.600">{user?.email || 'E-posta yok'}</Text>
              </Box>
            </HStack>
          </Flex>
          
          <Flex justify="space-between" mt={4}>
            <Button 
              colorScheme="blue" 
              size="sm" 
              onClick={handleRefreshUserData}
            >
              Kullanıcı Bilgilerini Yenile
            </Button>
            
            <Button 
              colorScheme="red" 
              size="sm" 
              onClick={logout}
            >
              Çıkış Yap
            </Button>
          </Flex>
          
          {/* Debug bilgileri */}
          <Box mt={8} p={4} bg="gray.50" borderRadius="md">
            <Heading size="sm" mb={2}>Debug Bilgileri</Heading>
            <Text fontSize="xs">isAuthenticated: {isAuthenticated ? 'true' : 'false'}</Text>
            <Text fontSize="xs">User Object: {user ? JSON.stringify(user, null, 2) : 'null'}</Text>
            <Text fontSize="xs">Cookie Token: {Cookies.get('accessToken') ? 'Var' : 'Yok'}</Text>
            <Text fontSize="xs">LocalStorage Token: {typeof window !== 'undefined' && localStorage.getItem('accessToken') ? 'Var' : 'Yok'}</Text>
            <Text fontSize="xs">Token Content: {getTokenInfo()}</Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}


