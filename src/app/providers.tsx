'use client';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';

/**
 * Emotion cache + useServerInsertedHTML keeps SSR and client style injection aligned
 * (avoids hydration mismatches with Chakra under Next.js App Router / Turbopack).
 */
export function Providers({ children }: { children: ReactNode }) {
  const [cache] = useState(() => {
    const c = createCache({ key: 'chakra', prepend: true });
    c.compat = true;
    return c;
  });

  useServerInsertedHTML(() => {
    const inserted = cache.inserted;
    if (Object.keys(inserted).length === 0) {
      return null;
    }
    let styles = '';
    for (const id in inserted) {
      const css = inserted[id];
      if (css !== true) {
        styles += css;
      }
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${Object.keys(inserted).join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
