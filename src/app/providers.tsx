// app/providers.tsx
'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { EmotionCacheProvider } from './EmotionCache';
import { theme } from './theme';
import PeriodicZoneNotificationScheduler from './components/main/PeriodicZoneNotificationScheduler';
import { ChatProvider } from './components/agryChatBot/ChatProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionCacheProvider>
      <ChakraProvider theme={theme}>
        <PeriodicZoneNotificationScheduler />
        <ChatProvider>{children}</ChatProvider>
      </ChakraProvider>
    </EmotionCacheProvider>
  );
}
