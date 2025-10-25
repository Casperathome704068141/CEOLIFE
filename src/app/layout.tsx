
import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'BENO 1017 – Chief of Staff',
  description: 'Executive-grade life operating system for finance, home, and wellness.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-slate-950 text-slate-100 antialiased">
        <AppProviders>
          <FirebaseClientProvider>{children}</FirebaseClientProvider>
        </AppProviders>
      </body>
    </html>
  );
}
