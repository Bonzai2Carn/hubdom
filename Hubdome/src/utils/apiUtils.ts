// src/utils/apiUtils.ts
import { SerializedError } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

/**
 * Standard error response format for API errors
 */
export interface ApiError {
  error: string;
  status?: number;
  details?: Record<string, string[]>;
  code?: string;
  isNetworkError?: boolean;
  isServerError?: boolean;
}

/**
 * Extract error message from various error types
 * @param error The error object to process
 * @returns A formatted error message string or generic message
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
    return error.error;
  }

  // Default case for unknown error types
  return 'An unknown error occurred';
}

/**
 * Processes API errors to a standardized format
 * @param error The error to process
 * @returns A standardized ApiError object
 */
export function handleApiError(error: unknown): ApiError {
  // Default error response
  let errorResponse: ApiError = {
    error: getErrorMessage(error),
  };

  // Handle Axios errors
  if (isAxiosError(error) && error.response) {
    errorResponse.status = error.response.status;
    
    // Add validation details if available
    if ((error.response.data as { details?: Record<string, string[]> })?.details) {
      errorResponse.details = (error.response.data as { details?: Record<string, string[]> }).details;
    }
    
    // Determine error type
    errorResponse.isServerError = error.response.status >= 500;
    errorResponse.isNetworkError = false;
    
    // Extract error code if available
    if ((error.response.data as { code?: string })?.code) {
      errorResponse.code = (error.response.data as { code?: string }).code;
    }
  }
  
  // Handle network errors (no response received)
  if (isAxiosError(error) && !error.response) {
    errorResponse.isNetworkError = true;
    errorResponse.error = 'Network error. Please check your internet connection.';
  }
  
  // Pass through existing API errors
  if (isApiErrorObject(error)) {
    return error;
  }

  return errorResponse;
}

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
    'error' in error
  );
}

/**
 * Format validation errors for display
 * @param details Validation error details from API
 * @returns Formatted validation error message
 */
export function formatValidationErrors(details?: Record<string, string[]>): string {
  if (!details) return '';

  return Object.entries(details)
    .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
    .join('\n');
}

/**
 * Maps error status codes to user-friendly messages
 * @param status HTTP status code
 * @returns User-friendly error message
 */
export function getErrorMessageByStatus(status?: number): string {
  if (!status) return 'An unknown error occurred';
  
  const errorMessages: Record<number, string> = {
    400: 'The request was invalid. Please check your input.',
    401: 'You are not authorized. Please log in and try again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    422: 'The data provided is invalid.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.',
    502: 'Server error. Please try again later.',
    503: 'Service unavailable. Please try again later.',
    504: 'Server timeout. Please try again later.',
  };
  
  return errorMessages[status] || 'An error occurred. Please try again.';
}

/**
 * Enhanced error object with additional information
 */
export interface EnhancedError extends Error {
  code?: string;
  status?: number;
  isNetworkError?: boolean;
  isServerError?: boolean;
  isInputError?: boolean;
  isAuthError?: boolean;
  originalError?: any;
}

/**
 * Creates an enhanced error from an API error
 * @param apiError API error object
 * @returns Enhanced error with additional metadata
 */
export function createEnhancedError(apiError: ApiError): EnhancedError {
  const enhancedError: EnhancedError = new Error(apiError.error);
  enhancedError.code = apiError.code;
  enhancedError.status = apiError.status;
  enhancedError.isNetworkError = apiError.isNetworkError;
  enhancedError.isServerError = apiError.isServerError;
  enhancedError.isInputError = apiError.status === 400 || apiError.status === 422;
  enhancedError.isAuthError = apiError.status === 401 || apiError.status === 403;
  
  return enhancedError;
}