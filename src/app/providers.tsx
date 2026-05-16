// app/providers.tsx
'use client';

import { useEffect } from 'react';
import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import {
  App as AntdApp,
  ConfigProvider as AntdConfigProvider,
  theme as antdAlgorithm,
} from 'antd';
import { EmotionCacheProvider } from './EmotionCache';
import { theme } from './theme';
import { antdTheme } from './styles/antdTheme';
import PeriodicZoneNotificationScheduler from './components/main/PeriodicZoneNotificationScheduler';

/**
 * Bridges Chakra's color mode to:
 *   - the `data-theme` attribute on <html> (consumed by SCSS + Tailwind `dark:` utilities)
 *   - AntD's `darkAlgorithm` / `defaultAlgorithm`
 *
 * Keeps a single source of truth (Chakra) for the toggle while every
 * library renders the matching theme.
 */
function ThemedAntdProvider({ children }: { children: React.ReactNode }) {
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = colorMode;
    }
  }, [colorMode]);

  return (
    <AntdConfigProvider
      theme={{
        ...antdTheme,
        algorithm:
          colorMode === 'dark'
            ? antdAlgorithm.darkAlgorithm
            : antdAlgorithm.defaultAlgorithm,
      }}
    >
      <AntdApp
        component={false}
        message={{ maxCount: 3 }}
        notification={{ placement: 'topRight' }}
      >
        {children}
      </AntdApp>
    </AntdConfigProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionCacheProvider>
      <ChakraProvider theme={theme}>
        <ThemedAntdProvider>
          <PeriodicZoneNotificationScheduler />
          {children}
        </ThemedAntdProvider>
      </ChakraProvider>
    </EmotionCacheProvider>
  );
}
