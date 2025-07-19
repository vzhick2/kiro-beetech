'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestConnectionPage() {
  const [status, setStatus] = useState<string>('Testing...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        setStatus('Testing Supabase connection...')
        
        // Test basic connection
        const { error } = await supabase
          .from('items')
          .select('count')
          .limit(1)
        
        if (error) {
          setError(`Supabase error: ${error.message}`)
          setStatus('Failed')
          return
        }
        
        setStatus('Connection successful!')
      } catch (err) {
        setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setStatus('Failed')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Connection Test</h1>
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>
        {error && (
          <div className="text-red-600">
            <strong>Error:</strong> {error}
          </div>
        )}
        <div>
          <strong>Environment Variables:</strong>
          <div className="mt-2 space-y-1 text-sm">
            <div>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}</div>
            <div>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</div>
          </div>
        </div>
      </div>
    </div>
  )
} 