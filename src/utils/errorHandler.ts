import { ApiError } from '../types';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

// Error messages
export const ERROR_MESSAGES = {
  [ErrorType.NETWORK]: 'Network connection error. Please check your internet connection.',
  [ErrorType.TIMEOUT]: 'Request timeout. Please try again.',
  [ErrorType.UNAUTHORIZED]: 'You are not authorized to perform this action.',
  [ErrorType.FORBIDDEN]: 'Access denied. You don\'t have permission to access this resource.',
  [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorType.SERVER_ERROR]: 'Server error. Please try again later.',
  [ErrorType.VALIDATION]: 'Please check your input and try again.',
  [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.',
};

// Parse error from axios response
export const parseError = (error: any): ApiError => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;
    
    let errorType: ErrorType;
    switch (status) {
      case 400:
        errorType = ErrorType.VALIDATION;
        break;
      case 401:
        errorType = ErrorType.UNAUTHORIZED;
        break;
      case 403:
        errorType = ErrorType.FORBIDDEN;
        break;
      case 404:
        errorType = ErrorType.NOT_FOUND;
        break;
      case 408:
        errorType = ErrorType.TIMEOUT;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorType = ErrorType.SERVER_ERROR;
        break;
      default:
        errorType = ErrorType.UNKNOWN;
    }
    
    return {
      message: data?.message || ERROR_MESSAGES[errorType],
      code: data?.code || errorType,
      status,
      details: data,
    };
  } else if (error.request) {
    // Network error
    return {
      message: ERROR_MESSAGES[ErrorType.NETWORK],
      code: ErrorType.NETWORK,
      status: 0,
      details: error.request,
    };
  } else {
    // Other error
    return {
      message: error.message || ERROR_MESSAGES[ErrorType.UNKNOWN],
      code: ErrorType.UNKNOWN,
      status: 0,
      details: error,
    };
  }
};

// Get user-friendly error message
export const getErrorMessage = (error: any): string => {
  const parsedError = parseError(error);
  return parsedError.message;
};

// Check if error is retryable
export const isRetryableError = (error: any): boolean => {
  const parsedError = parseError(error);
  return [
    ErrorType.NETWORK,
    ErrorType.TIMEOUT,
    ErrorType.SERVER_ERROR,
  ].includes(parsedError.code as ErrorType);
};
