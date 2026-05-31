import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

/**
 * General API Rate Limiter
 */
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later',
    });
  },
});

/**
 * Authentication Rate Limiter (Stricter)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many login attempts, please try again later',
    });
  },
});

/**
 * Upload Rate Limiter
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: 'Too many uploads, please try again later',
  handler: (req, res) => {
    logger.warn(`Upload rate limit exceeded for user: ${req.user?.id}`);
    res.status(429).json({
      success: false,
      message: 'Too many uploads, please try again later',
    });
  },
});

export default { apiLimiter, authLimiter, uploadLimiter };
