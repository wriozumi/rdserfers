export class AppError extends Error {
  public code?: string;
  public status?: number;
  public context?: Record<string, any>;

  constructor(
    message: string,
    code?: string,
    status?: number,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.context = context;
  }
}

export class NetworkError extends AppError {
  constructor(message: string, status?: number) {
    super(message, 'NETWORK_ERROR', status);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400, { field });
    this.name = 'ValidationError';
  }
}

export function handleApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return new NetworkError('Request timeout');
    }

    if (error.message.includes('fetch')) {
      return new NetworkError('Network connection failed');
    }

    return new AppError(error.message);
  }

  return new AppError('An unexpected error occurred');
}

export function logError(error: AppError, context?: string) {
  const logData = {
    message: error.message,
    code: error.code,
    status: error.status,
    context: context || 'Unknown',
    timestamp: new Date().toISOString(),
    ...(error.context || {}),
  };

  console.error('[Error]', logData);

  if (import.meta.env.PROD) {
  }
}
