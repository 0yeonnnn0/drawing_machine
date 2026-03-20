import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth/auth-context';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'DoodleShare',
  description: 'Draw together, every pixel counts.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="selection:bg-retro-blue selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
