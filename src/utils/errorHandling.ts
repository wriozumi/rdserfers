// Enhanced error handling utilities for production readiness

export class AppError extends Error {
  public code?: string;
  public statusCode?: number;
  public details?: Record<string, any>;

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  timestamp?: number;
  userAgent?: string;
  url?: string;
  details?: Record<string, any>;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: Array<{
    error: Error;
    context: ErrorContext;
    timestamp: number;
  }> = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  logError(error: Error, context: ErrorContext = {}): void {
    const timestamp = Date.now();

    const logEntry = {
      error,
      context: {
        ...context,
        timestamp,
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
      timestamp,
    };

    this.errorLog.push(logEntry);

    // Keep only last 100 errors in memory
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group(`🚨 Error in ${context.component || 'Unknown Component'}`);
      console.error('Error:', error);
      console.info('Context:', context);
      console.groupEnd();
    }

    // In production, you would send this to an error reporting service
    // this.sendToErrorService(logEntry);
  }

  getErrorLog(): Array<{
    error: Error;
    context: ErrorContext;
    timestamp: number;
  }> {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }
}

export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  context: ErrorContext = {}
): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const data = await asyncFn();
    return { data, error: null };
  } catch (error) {
    const appError = error instanceof Error ? error : new Error(String(error));
    ErrorHandler.getInstance().logError(appError, context);
    return { data: null, error: appError };
  }
};

export const handleSyncError = <T>(
  syncFn: () => T,
  context: ErrorContext = {}
): { data: T | null; error: Error | null } => {
  try {
    const data = syncFn();
    return { data, error: null };
  } catch (error) {
    const appError = error instanceof Error ? error : new Error(String(error));
    ErrorHandler.getInstance().logError(appError, context);
    return { data: null, error: appError };
  }
};

// Utility function to create user-friendly error messages
export const getUserFriendlyMessage = (error: Error): string => {
  if (error instanceof AppError && error.code) {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      case 'TIMEOUT':
        return 'The request took too long to complete. Please try again.';
      case 'SERVICE_UNAVAILABLE':
        return 'The service is temporarily unavailable. Please try again in a few minutes.';
      case 'INVALID_QUERY':
        return 'Please enter a valid search term.';
      case 'STATION_NOT_FOUND':
        return 'The selected station could not be found.';
      case 'BOOKING_NOT_FOUND':
        return 'The booking could not be found. It may have been deleted or you may not have permission to view it.';
      case 'DATE_CONFLICT':
        return 'The selected dates are not available. Please choose different dates.';
      case 'INVALID_DATE_RANGE':
        return 'Please select valid dates.';
      case 'PAST_DATE':
        return 'The selected date cannot be in the past.';
      case 'DURATION_TOO_LONG':
        return 'The booking duration is too long. Maximum allowed duration is 365 days.';
      default:
        return error.message;
    }
  }

  // Generic error messages based on common error patterns
  if (error.message.toLowerCase().includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }
  if (error.message.toLowerCase().includes('timeout')) {
    return 'Request timeout. Please try again.';
  }
  if (error.message.toLowerCase().includes('not found')) {
    return 'The requested resource was not found.';
  }
  if (error.message.toLowerCase().includes('unauthorized')) {
    return 'You are not authorized to perform this action.';
  }
  if (error.message.toLowerCase().includes('forbidden')) {
    return 'Access to this resource is forbidden.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
};

// Retry utility with exponential backoff
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
  context: ErrorContext = {}
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 0.3; // ±30% jitter
        await new Promise(resolve => setTimeout(resolve, delay * (1 + jitter)));
      }

      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        ErrorHandler.getInstance().logError(lastError, {
          ...context,
          action: 'retry_failed',
          details: { maxRetries, attempt },
        });
        throw lastError;
      }

      ErrorHandler.getInstance().logError(lastError, {
        ...context,
        action: 'retry_attempt',
        details: { attempt, maxRetries },
      });
    }
  }

  throw lastError!;
};

export default ErrorHandler;
