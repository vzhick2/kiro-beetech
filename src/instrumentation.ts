import { NextRequest } from 'next/server'

// This function runs once when the server starts
export async function register() {
  // Initialize observability tools
  console.log('🚀 KIRO Inventory Management Server initialized')
  console.log('📊 Telemetry and monitoring active')
  
  // You can initialize tools like:
  // - Sentry for error tracking
  // - DataDog for performance monitoring
  // - Custom analytics
}

// This function runs on every request error (Next.js 15 feature)
export async function onRequestError(
  error: Error,
  request: NextRequest,
  context: {
    routerKind: 'App Router' | 'Pages Router'
    routePath: string
    routeType: 'render' | 'route' | 'action' | 'middleware'
    renderSource: 'react-server-components' | 'react-server-components-payload' | 'server-rendering'
  }
) {
  // Log error details
  console.error('🚨 Server Error:', {
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    userAgent: request.headers.get('user-agent'),
    context,
    timestamp: new Date().toISOString(),
  })

  // In production, you'd send this to your error tracking service
  // Example: await sentry.captureException(error, { extra: { request, context } })
  
  // Example: Send to custom analytics
  // await fetch('/api/telemetry/errors', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ error: error.message, context, timestamp: Date.now() })
  // })
}
