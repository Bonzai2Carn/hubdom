// src/utils/errorUtils.ts
import { Alert, Platform } from 'react-native';
import { ApiError } from '../services/api';

/**
 * Error with additional metadata for better handling
 */
export interface EnhancedError extends Error {
  code?: string;
  isNetworkError?: boolean;
  isServerError?: boolean;
  isInputError?: boolean;
  isAuthError?: boolean;
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
 * Handle API errors with standardized approach
 */
export const handleApiError = (
  error: any,
  options: ErrorHandlingOptions = {}
): EnhancedError => {
  const opts = { ...defaultOptions, ...options };
  let enhancedError: EnhancedError;
  
  // Convert API error to standardized error format
  if (isApiError(error)) {
    enhancedError = {
      name: 'ApiError',
      message: error.message || opts.fallbackMessage!,
      code: error.code,
      isNetworkError: error.isNetworkError,
      isServerError: error.isServerError,
      isAuthError: error.status === 401 || error.status === 403,
      isInputError: error.status === 400 || error.status === 422,
      originalError: error,
    };
  } else if (error instanceof Error) {
    enhancedError = {
      ...error,
      isNetworkError: error.message?.includes('network') || error.message?.includes('connection'),
      originalError: error,
    };
  } else {
    enhancedError = {
      name: 'UnknownError',
      message: opts.fallbackMessage!,
      originalError: error,
    };
  }
  
  // Log error to console if enabled
  if (opts.logError) {
    console.error('[ERROR]', enhancedError);
  }
  
  // Show alert if enabled
  if (opts.showAlert) {
    showErrorAlert(enhancedError, opts.title!);
  }
  
  // Handle specific error types
  if (enhancedError.isAuthError && opts.onAuthError) {
    opts.onAuthError();
  } else if (enhancedError.isNetworkError && opts.onNetworkError) {
    opts.onNetworkError();
  } else if (enhancedError.isServerError && opts.onServerError) {
    opts.onServerError();
  } else if (enhancedError.isInputError && opts.onInputError) {
    opts.onInputError();
  }
  
  // Run finally callback if provided
  if (opts.onFinally) {
    opts.onFinally();
  }
  
  return enhancedError;
};

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
export const showErrorAlert = (error: Error | string, title: string = 'Error'): void => {
  const message = typeof error === 'string' ? error : error.message;
  
  Alert.alert(
    title,
    message,
    [{ text: 'OK' }],
    { cancelable: true }
  );
};

/**
 * Check if an error is an API error
 */
export const isApiError = (error: any): error is ApiError => {
  return error && typeof error === 'object' && 
    (error.status !== undefined || 
    error.isNetworkError !== undefined || 
    error.isServerError !== undefined);
};

/**
 * Format error message for display
 */
export const formatErrorMessage = (error: any): string => {
  if (isApiError(error)) {
    return error.message;
  } else if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'An unexpected error occurred';
  }
};