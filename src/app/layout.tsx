import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/providers/query-provider'
import ErrorBoundary from '@/components/error-boundary'
import { logger } from '@/lib/debug'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KIRO Inventory Management',
  description: 'Modern inventory management system for small businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Log layout initialization
  logger.componentLifecycle('RootLayout', 'initialized')

  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}