'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Flex, Spinner, Text, Box, Heading, Button } from '@chakra-ui/react';
import Cookies from 'js-cookie';

export default function GoogleCallback() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Processing Google authentication callback');
        
        // Cookie'den token'ı kontrol et
        const token = Cookies.get('accessToken');
        if (!token) {
          console.log('No token found in cookies');
          setError('Authentication failed: No token received');
          setLocalLoading(false);
          return;
        }
        
        console.log('Token found in cookies, redirecting to dashboard');
        
        // Kullanıcı bilgileri yüklendiğinde dashboard'a yönlendir
        if (!loading && user) {
          router.push('/dashboard');
        } else if (!loading && !user) {
          setError('Authentication failed: User data not found');
          setLocalLoading(false);
        }
      } catch (error: any) {
        console.error('Failed to process authentication:', error);
        setError(error.message || 'Failed to process authentication');
        setLocalLoading(false);
      }
    };

    handleCallback();
  }, [router, user, loading]);

  if (loading || localLoading) {
    return (
      <Flex direction="column" align="center" justify="center" height="100vh">
        <Spinner size="xl" mb={4} />
        <Text>Giriş işlemi tamamlanıyor...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" align="center" justify="center" height="100vh" p={4}>
        <Box textAlign="center" p={6} borderRadius="md" bg="red.50" maxW="md">
          <Heading size="md" mb={4} color="red.500">Giriş Hatası</Heading>
          <Text mb={6}>{error}</Text>
          <Button colorScheme="blue" onClick={() => router.push('/login')}>
            Giriş Sayfasına Dön
          </Button>
        </Box>
      </Flex>
    );
  }

  return null;
}
