import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/providers/query-provider'
import ErrorBoundary from '@/components/error-boundary'
import { AppLayoutServer } from '@/components/layout/app-layout-server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KIRO Inventory Management',
  description: 'Modern inventory management system for small businesses',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover' as const,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <QueryProvider>
            <AppLayoutServer>
              {children}
            </AppLayoutServer>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}