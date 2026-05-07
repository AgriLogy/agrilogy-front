// app/layout.tsx
import './globals.scss';
import { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ColorModeScript } from '@chakra-ui/react';
import { Providers } from './providers';
import { chakraColorModeConfig } from './colorModeConfig';

export const metadata: Metadata = {
  title: 'Agrilogy',
  description:
    'Agrilogy is an innovative agriculture automation solution designed to enhance productivity, sustainability, and efficiency in farming. By utilizing smart technology and data-driven insights, Agrilogy optimizes irrigation, crop monitoring, and supply chain management, empowering farmers to achieve higher yields and reduce costs while promoting eco-friendly practices.',
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
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
