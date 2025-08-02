import { useState, useCallback, useRef } from 'react';
import { ErrorWithRetry, createError, ErrorCodes } from '@/components/error/ErrorHandling';

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: any, attempt: number) => boolean;
}

interface RetryState {
  isRetrying: boolean;
  attemptCount: number;
  lastError?: ErrorWithRetry;
}

export function useRetryableOperation<T = any>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    retryCondition = (error, attempt) => attempt < maxRetries,
  } = options;

  const [retryState, setRetryState] = useState<RetryState>({
    isRetrying: false,
    attemptCount: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const calculateDelay = (attempt: number): number => {
    const exponentialDelay = baseDelay * Math.pow(backoffFactor, attempt);
    const jitteredDelay = exponentialDelay * (0.5 + Math.random() * 0.5); // Add jitter
    return Math.min(jitteredDelay, maxDelay);
  };

  const executeWithRetry = useCallback(async (): Promise<T> => {
    // Cancel any ongoing operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    let attempt = 0;

    setRetryState({
      isRetrying: true,
      attemptCount: 0,
    });

    while (attempt <= maxRetries) {
      try {
        setRetryState(prev => ({
          ...prev,
          attemptCount: attempt + 1,
        }));

        const result = await operation();
        
        setRetryState({
          isRetrying: false,
          attemptCount: attempt + 1,
        });

        return result;
      } catch (error) {
        attempt++;
        
        const shouldRetry = retryCondition(error, attempt);
        
        if (!shouldRetry || attempt > maxRetries) {
          const categorizedError = categorizeError(error);
          setRetryState({
            isRetrying: false,
            attemptCount: attempt,
            lastError: categorizedError,
          });
          throw categorizedError;
        }

        // Wait before retry with exponential backoff
        const delay = calculateDelay(attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));

        // Check if operation was cancelled
        if (abortControllerRef.current?.signal.aborted) {
          throw createError(ErrorCodes.UNKNOWN_ERROR, 'Operation cancelled');
        }
      }
    }

    throw createError(ErrorCodes.UNKNOWN_ERROR, 'Max retries exceeded');
  }, [operation, maxRetries, baseDelay, maxDelay, backoffFactor, retryCondition]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setRetryState({
      isRetrying: false,
      attemptCount: 0,
    });
  }, []);

  const reset = useCallback(() => {
    setRetryState({
      isRetrying: false,
      attemptCount: 0,
    });
  }, []);

  return {
    execute: executeWithRetry,
    cancel,
    reset,
    ...retryState,
  };
}

// Helper function to categorize different types of errors
function categorizeError(error: any): ErrorWithRetry {
  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return createError(ErrorCodes.NETWORK_ERROR, error);
  }

  // Firebase errors
  if (error?.code?.startsWith?.('auth/') || error?.code?.startsWith?.('storage/')) {
    return categorizeFirebaseError(error);
  }

  // File validation errors
  if (error?.message?.includes?.('file size') || error?.message?.includes?.('too large')) {
    return createError(ErrorCodes.FILE_TOO_LARGE, error);
  }

  if (error?.message?.includes?.('file type') || error?.message?.includes?.('invalid format')) {
    return createError(ErrorCodes.INVALID_FILE_TYPE, error);
  }

  // Default to unknown error
  return createError(ErrorCodes.UNKNOWN_ERROR, error);
}

function categorizeFirebaseError(error: any): ErrorWithRetry {
  const errorCode = error?.code || '';
  
  if (errorCode.includes('network') || errorCode.includes('unavailable')) {
    return createError(ErrorCodes.NETWORK_ERROR, error);
  }
  
  if (errorCode.includes('permission-denied')) {
    return createError(ErrorCodes.PERMISSION_DENIED, error);
  }
  
  if (errorCode.includes('unauthenticated')) {
    return createError(ErrorCodes.AUTHENTICATION_ERROR, error);
  }
  
  return createError(ErrorCodes.FIREBASE_ERROR, error);
}