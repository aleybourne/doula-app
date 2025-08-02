import React from 'react';
import { AlertTriangle, WifiOff, Clock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

export interface ErrorWithRetry {
  code: string;
  message: string;
  retryable: boolean;
  retryDelay?: number;
  userAction?: string;
}

export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  FIREBASE_ERROR: 'FIREBASE_ERROR',
  STORAGE_QUOTA: 'STORAGE_QUOTA',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  RATE_LIMITED: 'RATE_LIMITED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

export function createError(
  code: ErrorCode,
  originalError?: Error | string,
  context?: Record<string, any>
): ErrorWithRetry {
  const baseErrors: Record<ErrorCode, Omit<ErrorWithRetry, 'code'>> = {
    [ErrorCodes.NETWORK_ERROR]: {
      message: 'Network connection failed. Please check your internet connection and try again.',
      retryable: true,
      retryDelay: 3000,
      userAction: 'Check your internet connection',
    },
    [ErrorCodes.FIREBASE_ERROR]: {
      message: 'Service temporarily unavailable. Please try again in a moment.',
      retryable: true,
      retryDelay: 5000,
      userAction: 'Wait a moment and try again',
    },
    [ErrorCodes.STORAGE_QUOTA]: {
      message: 'Storage limit reached. Please free up space or contact support.',
      retryable: false,
      userAction: 'Free up storage space',
    },
    [ErrorCodes.FILE_TOO_LARGE]: {
      message: 'File is too large. Please choose a smaller file (max 10MB).',
      retryable: false,
      userAction: 'Choose a smaller file',
    },
    [ErrorCodes.INVALID_FILE_TYPE]: {
      message: 'Invalid file type. Please choose a supported image format (JPG, PNG, WebP).',
      retryable: false,
      userAction: 'Choose a supported file format',
    },
    [ErrorCodes.AUTHENTICATION_ERROR]: {
      message: 'Authentication failed. Please sign in again.',
      retryable: false,
      userAction: 'Sign in again',
    },
    [ErrorCodes.PERMISSION_DENIED]: {
      message: 'Permission denied. You may not have access to this resource.',
      retryable: false,
      userAction: 'Contact your administrator',
    },
    [ErrorCodes.RATE_LIMITED]: {
      message: 'Too many requests. Please wait a moment before trying again.',
      retryable: true,
      retryDelay: 10000,
      userAction: 'Wait before trying again',
    },
    [ErrorCodes.UNKNOWN_ERROR]: {
      message: 'An unexpected error occurred. Please try again.',
      retryable: true,
      retryDelay: 2000,
      userAction: 'Try again',
    },
  };

  const baseError = baseErrors[code];
  let detailedMessage = baseError.message;

  // Add context to error message if available
  if (originalError) {
    const errorMsg = typeof originalError === 'string' ? originalError : originalError.message;
    if (process.env.NODE_ENV === 'development') {
      detailedMessage += ` (${errorMsg})`;
    }
  }

  return {
    code,
    message: detailedMessage,
    retryable: baseError.retryable,
    retryDelay: baseError.retryDelay,
    userAction: baseError.userAction,
  };
}

interface ErrorDisplayProps {
  error: ErrorWithRetry;
  onRetry?: () => void;
  onDismiss?: () => void;
  showRetryButton?: boolean;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  showRetryButton = true,
  className = '',
}) => {
  const getErrorIcon = () => {
    switch (error.code) {
      case ErrorCodes.NETWORK_ERROR:
        return <WifiOff className="h-4 w-4" />;
      case ErrorCodes.RATE_LIMITED:
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Alert className={`border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive ${className}`}>
      {getErrorIcon()}
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium">{error.message}</p>
          {error.userAction && (
            <p className="text-sm text-muted-foreground mt-1">
              Suggested action: {error.userAction}
            </p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          {error.retryable && showRetryButton && onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Retry
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

// Utility function to show error toasts with retry
export function showErrorToast(error: ErrorWithRetry, onRetry?: () => void) {
  toast({
    title: "Error",
    description: error.message,
    variant: "destructive",
    action: error.retryable && onRetry ? (
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="flex items-center gap-1"
      >
        <RotateCcw className="h-3 w-3" />
        Retry
      </Button>
    ) : undefined,
  });
}

// Helper to categorize Firebase errors
export function categorizeFirebaseError(error: any): ErrorWithRetry {
  const errorCode = error?.code || '';
  const errorMessage = error?.message || '';

  if (errorCode.includes('network') || errorCode.includes('unavailable')) {
    return createError(ErrorCodes.NETWORK_ERROR, error);
  }

  if (errorCode.includes('permission-denied')) {
    return createError(ErrorCodes.PERMISSION_DENIED, error);
  }

  if (errorCode.includes('unauthenticated')) {
    return createError(ErrorCodes.AUTHENTICATION_ERROR, error);
  }

  if (errorCode.includes('quota-exceeded') || errorMessage.includes('quota')) {
    return createError(ErrorCodes.STORAGE_QUOTA, error);
  }

  if (errorCode.includes('resource-exhausted')) {
    return createError(ErrorCodes.RATE_LIMITED, error);
  }

  return createError(ErrorCodes.FIREBASE_ERROR, error);
}