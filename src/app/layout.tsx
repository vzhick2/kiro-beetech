import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { ToastProvider } from '@/providers/toast-provider';
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
  // These will be dynamically adjusted by ZoomPrevention component
  // based on detected desktop vs mobile mode
  maximumScale: 3,
  minimumScale: 0.5,
  userScalable: true,
  viewportFit: 'cover' as const,
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
            <ToastProvider>
              <AppLayoutServer>{children}</AppLayoutServer>
            </ToastProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
