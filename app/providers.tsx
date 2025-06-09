'use client';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from '@/context/AuthContext';

// Chakra UI tema yapılandırması
const theme = extendTheme({
  colors: {
    blue: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
      950: "#082f49",
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>{children}</AuthProvider>
    </ChakraProvider>
  );
}