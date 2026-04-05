// app/layout.tsx
import { Providers } from './providers';
import { Metadata } from 'next';
import { ColorModeScript } from '@chakra-ui/react';
import { chakraColorModeConfig } from './colorModeConfig';

export const metadata: Metadata = {
  title: 'Agrilogy',
  description:
    'Agrilogy is an innovative agriculture automation solution designed to enhance productivity, sustainability, and efficiency in farming. By utilizing smart technology and data-driven insights, Agrilogy optimizes irrigation, crop monitoring, and supply chain management, empowering farmers to achieve higher yields and reduce costs while promoting eco-friendly practices.',
  // metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ColorModeScript
          initialColorMode={chakraColorModeConfig.initialColorMode}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
