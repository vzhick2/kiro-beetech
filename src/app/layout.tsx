import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import ErrorBoundary from '@/components/error-boundary';
import { AppLayoutServer } from '@/components/layout/app-layout-server';
import { ZoomPrevention } from '@/components/layout/zoom-prevention';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KIRO Inventory Management',
  description: 'Modern inventory management system for small businesses',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover' as const,
  // Additional mobile zoom prevention
  shrinkToFit: false,
  // Force no scaling on any mobile device
  scalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-touch-fullscreen" content="yes" />
      </head>
      <body className={inter.className}>
        <ZoomPrevention />
        <ErrorBoundary>
          <QueryProvider>
            <AppLayoutServer>{children}</AppLayoutServer>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
