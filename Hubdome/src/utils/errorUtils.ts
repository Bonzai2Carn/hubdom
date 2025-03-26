// src/utils/errorUtils.ts
import { AxiosError } from 'axios';
import { SerializedError } from '@reduxjs/toolkit';

/**
 * Standard error response format for API errors
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, string[]>;
  isNetworkError?: boolean;
  isServerError?: boolean;
  originalError?: any;
}

/**
 * Options for error handling
 */
export interface ErrorHandlingOptions {
  showAlert?: boolean;
  logError?: boolean;
  title?: string;
  fallbackMessage?: string;
  onAuthError?: () => void;
  onNetworkError?: () => void;
  onServerError?: () => void;
  onInputError?: () => void;
  onFinally?: () => void;
}

/**
 * Default options for error handling
 */
const defaultOptions: ErrorHandlingOptions = {
  showAlert: true,
  logError: true,
  title: 'Error',
  fallbackMessage: 'An unexpected error occurred. Please try again later.',
};

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  // Handle Axios errors
  if (isAxiosError(error)) {
    return (
      (error.response?.data as any)?.error ||
      (error.response?.data as any)?.message ||
      error.message ||
      'An error occurred with the request'
    );
  }

  // Handle serialized RTK errors
  if (isRtkError(error)) {
    return error.message || 'An unexpected error occurred';
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle API error objects
  if (isApiErrorObject(error)) {
    return error.message;
  }

  // Default case for unknown error types
  return 'An unknown error occurred';
}

/**
 * Handle API errors with standardized approach
 */
export function handleApiError(
  error: unknown,
  options: ErrorHandlingOptions = {}
): ApiError {
  const opts = { ...defaultOptions, ...options };
  let apiError: ApiError;
  
  // Convert different error types to standardized ApiError format
  if (isAxiosError(error)) {
    apiError = {
      message: getErrorMessage(error),
      status: error.response?.status,
      code: (error.response?.data as any)?.code,
      details: (error.response?.data as any)?.details,
      isNetworkError: !error.response,
      isServerError: error.response?.status ? error.response.status >= 500 : false,
      originalError: error,
    };
  } else if (isApiErrorObject(error)) {
    apiError = error as ApiError;
  } else if (error instanceof Error) {
    apiError = {
      message: error.message,
      isNetworkError: error.message.includes('network') || error.message.includes('connection'),
      originalError: error,
    };
  } else {
    apiError = {
      message: opts.fallbackMessage || 'Unknown error',
      originalError: error,
    };
  }
  
  // Log error to console if enabled
  if (opts.logError) {
    console.error('[ERROR]', apiError);
  }
  
  // Show alert if enabled
  if (opts.showAlert) {
    showErrorAlert(apiError.message, opts.title!);
  }
  
  // Handle specific error types
  const isAuthError = apiError.status === 401 || apiError.status === 403;
  const isInputError = apiError.status === 400 || apiError.status === 422;
  
  if (isAuthError && opts.onAuthError) {
    opts.onAuthError();
  } else if (apiError.isNetworkError && opts.onNetworkError) {
    opts.onNetworkError();
  } else if (apiError.isServerError && opts.onServerError) {
    opts.onServerError();
  } else if (isInputError && opts.onInputError) {
    opts.onInputError();
  }
  
  // Run finally callback if provided
  if (opts.onFinally) {
    opts.onFinally();
  }
  
  return apiError;
}

/**
 * Helper for consistent error messages by status code
 */
export function getDefaultErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Bad request. Please check your input.',
    401: 'Not authenticated. Please login again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'Conflict with current state of the resource.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.'
  };

  return messages[status] || 'An unexpected error occurred.';
}

/**
 * Create a safe async function wrapper that handles errors
 */
export const createSafeFunction = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: ErrorHandlingOptions = {}
): ((...args: Parameters<T>) => Promise<ReturnType<T> | null>) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error, options);
      return null;
    }
  };
};

/**
 * Show error alert dialog with OK button
 */
export const showErrorAlert = (message: string, title: string = 'Error'): void => {
  console.error(`${title}: ${message}`);
  // Implement your alert mechanism here (e.g. Alert.alert for React Native)
};

/**
 * Type guard for Axios errors
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

/**
 * Type guard for RTK serialized errors
 */
function isRtkError(error: unknown): error is SerializedError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'name' in error
  );
}

/**
 * Type guard for API error objects
 */
function isApiErrorObject(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error
  );
}