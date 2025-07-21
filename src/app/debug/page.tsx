import { supabaseConfig } from '@/lib/supabase';

export default function DebugPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Debug Information</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Supabase Configuration</h2>
        <div className="space-y-2">
          <div>
            <strong>Has Service Key:</strong> {supabaseConfig.hasServiceKey ? '✅ Yes' : '❌ No'}
          </div>
          <div>
            <strong>Supabase URL:</strong> {supabaseConfig.url ? '✅ Set' : '❌ Missing'}
          </div>
          <div>
            <strong>Environment:</strong> {supabaseConfig.isProduction ? 'Production' : 'Development'}
          </div>
          <div>
            <strong>Node Environment:</strong> {process.env.NODE_ENV}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-yellow-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Environment Variables Status</h2>
        <div className="space-y-2">
          <div>
            <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
          </div>
          <div>
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
          </div>
          <div>
            <strong>SUPABASE_SERVICE_ROLE_KEY:</strong> {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}
          </div>
        </div>
      </div>

      {!supabaseConfig.hasServiceKey && (
        <div className="mt-6 bg-red-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">⚠️ Configuration Issue</h2>
          <p>
            The SUPABASE_SERVICE_ROLE_KEY environment variable is missing. 
            This will limit functionality that requires admin access to the database.
          </p>
          <p className="mt-2">
            To fix this, add the SUPABASE_SERVICE_ROLE_KEY to your Vercel environment variables.
          </p>
        </div>
      )}
    </div>
  );
}
