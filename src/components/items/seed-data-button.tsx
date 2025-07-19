'use client';

import { useState, useEffect } from 'react';
import { seedSampleData } from '@/app/actions/seed-data';

interface SeedDataButtonProps {
  onDataAdded?: () => void;
}

interface SeedResult {
  success: boolean;
  message?: string;
  error?: string;
  results?: Array<{
    item: string;
    success: boolean;
    error?: string;
  }>;
  summary?: {
    total: number;
    success: number;
    errors: number;
    ingredients: number;
    packaging: number;
  };
}

export function SeedDataButton({ onDataAdded }: SeedDataButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SeedResult | null>(null);

  // Auto-hide result after 5 seconds
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [result]);

  const handleSeedData = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await seedSampleData();
      setResult(response);

      if (response.success) {
        onDataAdded?.();
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleSeedData}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Adding Sample Data...' : 'Add Sample Data'}
      </button>

      {result && (
        <div
          className={`absolute top-full right-0 mt-2 p-3 rounded-md shadow-lg border max-w-sm z-10 ${
            result.success
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className={`font-medium text-sm ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {result.success
                  ? '✅ Sample Data Added!'
                  : '❌ Error Adding Sample Data'}
              </h3>

              <p
                className={`text-xs mt-1 ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {result.message || result.error}
              </p>

              {result.success && result.summary && (
                <div className="mt-2 text-xs text-green-700">
                  <p>
                    <strong>Summary:</strong>
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    <li>Total: {result.summary.total}</li>
                    <li>Success: {result.summary.success}</li>
                    <li>Errors: {result.summary.errors}</li>
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => setResult(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
