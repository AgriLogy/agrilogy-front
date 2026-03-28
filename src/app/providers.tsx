'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { CacheProvider } from '@emotion/react';
import { useEmotionCache } from '@chakra-ui/next-js/use-emotion-cache';

export function Providers({ children }: { children: React.ReactNode }) {
  const emotionCache = useEmotionCache({ key: 'chakra', prepend: true });

  return (
    <CacheProvider value={emotionCache}>
      <ChakraProvider>{children}</ChakraProvider>
    </CacheProvider>
  );
}
