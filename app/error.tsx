'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-center text-muted-foreground max-w-md">
          We apologize for the inconvenience. An error occurred while processing
          your request.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 w-full max-w-md">
            <summary className="cursor-pointer text-sm font-medium">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 whitespace-pre-wrap text-xs bg-muted p-4 rounded">
              {error.message}
              {error.stack && '\n\n' + error.stack}
            </pre>
          </details>
        )}
      </div>
      <div className="flex space-x-2">
        <Button onClick={reset} variant="outline">
          Try Again
        </Button>
        <Button onClick={() => (window.location.href = '/')}>Go Home</Button>
      </div>
    </div>
  );
}
