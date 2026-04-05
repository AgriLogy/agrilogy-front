import { ChatProvider } from './components/agryChatBot/ChatProvider';
import { Providers } from './providers';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Agrilogy',
  description: 'Agrilogy is an innovative agriculture automation solution...',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <ChatProvider>
            {children}
          </ChatProvider>
        </Providers>
      </body>
    </html>
  )
}