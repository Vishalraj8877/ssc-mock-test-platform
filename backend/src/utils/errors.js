/**
 * Custom Application Error
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async handler wrapper
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validation Error Handler
 */
export const validationError = (message) => {
  return new AppError(message, 400);
};

/**
 * Authentication Error Handler
 */
export const authenticationError = (message = 'Authentication failed') => {
  return new AppError(message, 401);
};

/**
 * Authorization Error Handler
 */
export const authorizationError = (message = 'Access denied') => {
  return new AppError(message, 403);
};

/**
 * Not Found Error Handler
 */
export const notFoundError = (message = 'Resource not found') => {
  return new AppError(message, 404);
};

/**
 * Conflict Error Handler
 */
export const conflictError = (message = 'Resource already exists') => {
  return new AppError(message, 409);
};

/**
 * Internal Server Error Handler
 */
export const internalServerError = (message = 'Internal server error') => {
  return new AppError(message, 500);
};

export default {
  AppError,
  asyncHandler,
  validationError,
  authenticationError,
  authorizationError,
  notFoundError,
  conflictError,
  internalServerError,
};
