// Simple error handling for small business app
export interface AppError {
  success: false;
  error: string;
  code?: string;
}

export interface AppSuccess<T = unknown> {
  success: true;
  data: T;
}

export type AppResult<T = unknown> = AppSuccess<T> | AppError;

// Simple error handler - no complex classes needed
export function handleError(error: unknown, context: string): AppError {
  // Handle different error types
  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      code: 'GENERAL_ERROR',
    };
  }

  if (typeof error === 'string') {
    return {
      success: false,
      error,
      code: 'VALIDATION_ERROR',
    };
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'message' in error) {
    return {
      success: false,
      error: (error as { message: string }).message,
      code: 'DATABASE_ERROR',
    };
  }

  return {
    success: false,
    error: `Unknown error occurred in ${context}`,
    code: 'UNKNOWN_ERROR',
  };
}

// Success wrapper
export function handleSuccess<T>(data: T): AppSuccess<T> {
  return {
    success: true,
    data,
  };
}

// Validation error helper
export function validationError(message: string): AppError {
  return {
    success: false,
    error: message,
    code: 'VALIDATION_ERROR',
  };
}

// Create error response for server actions
export function createErrorResponse(
  message: string,
  details?: unknown
): AppError {
  return {
    success: false,
    error: message,
    code: details ? 'DETAILED_ERROR' : 'GENERAL_ERROR',
  };
}

// Create success response for server actions
export function createSuccessResponse<T>(data: T): AppSuccess<T> {
  return {
    success: true,
    data,
  };
}
