import helmet from 'helmet';
import cors from 'cors';
import logger from '../utils/logger.js';

/**
 * Security Headers Middleware
 */
export const securityMiddleware = helmet();

/**
 * CORS Middleware
 */
export const corsMiddleware = cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

/**
 * Request Logging Middleware
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

/**
 * Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`Error: ${status} - ${message}`);

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default {
  securityMiddleware,
  corsMiddleware,
  requestLogger,
  errorHandler,
};
