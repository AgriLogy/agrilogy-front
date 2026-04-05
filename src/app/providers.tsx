// app/providers.tsx
'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { EmotionCacheProvider } from './EmotionCache';
import { theme } from './theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionCacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </EmotionCacheProvider>
  );
}
