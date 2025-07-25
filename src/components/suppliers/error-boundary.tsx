'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Table Error Boundary caught an error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            {...(this.state.error && { error: this.state.error })}
            retry={this.retry}
          />
        );
      }

      return (
        <DefaultErrorFallback
          {...(this.state.error && { error: this.state.error })}
          retry={this.retry}
        />
      );
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; retry: () => void }> = ({
  error,
  retry,
}) => (
  <Card className="p-6 m-4 border-red-200 bg-red-50">
    <div className="flex items-center gap-3 mb-4">
      <AlertTriangle className="h-5 w-5 text-red-600" />
      <h3 className="text-lg font-semibold text-red-800">
        Something went wrong with the supplier table
      </h3>
    </div>
    <p className="text-sm text-red-700 mb-4">
      The table encountered an unexpected error. This has been logged for our
      development team.
    </p>
    {error && (
      <details className="mb-4">
        <summary className="text-sm text-red-600 cursor-pointer">
          Technical details
        </summary>
        <pre className="text-xs text-red-600 mt-2 p-2 bg-red-100 rounded overflow-auto">
          {error.message}
        </pre>
      </details>
    )}
    <div className="flex gap-2">
      <Button
        onClick={retry}
        variant="outline"
        size="sm"
        className="text-red-700 border-red-300 hover:bg-red-100"
      >
        <RefreshCw className="h-3 w-3 mr-1" />
        Try Again
      </Button>
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        size="sm"
        className="text-red-700 border-red-300 hover:bg-red-100"
      >
        Reload Page
      </Button>
    </div>
  </Card>
);

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback,
}) => {
  return (
    <ErrorBoundaryClass {...(fallback && { fallback })}>
      {children}
    </ErrorBoundaryClass>
  );
};
