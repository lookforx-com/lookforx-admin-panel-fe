'use client';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

// Chakra UI temasını özelleştir
const theme = extendTheme({
  styles: {
    global: {
      // Global stilleri burada tanımlayabilirsiniz
      body: {
        bg: 'gray.50',
      },
    },
  },
  // Diğer tema özelleştirmeleri...
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <LanguageProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </LanguageProvider>
    </ChakraProvider>
  );
}