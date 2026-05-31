import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import logger from './logger.js';

/**
 * Generate JWT Token
 */
export const generateToken = (userId, role) => {
  try {
    const token = jwt.sign(
      { id: userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '15m' }
    );
    return token;
  } catch (error) {
    logger.error(`Token generation error: ${error.message}`);
    throw error;
  }
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (userId) => {
  try {
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
    return token;
  } catch (error) {
    logger.error(`Refresh token generation error: ${error.message}`);
    throw error;
  }
};

/**
 * Verify JWT Token
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    logger.error(`Token verification error: ${error.message}`);
    throw error;
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return decoded;
  } catch (error) {
    logger.error(`Refresh token verification error: ${error.message}`);
    throw error;
  }
};

/**
 * Generate Password Reset Token
 */
export const generatePasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  return token;
};

/**
 * Hash Password Reset Token
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  generatePasswordResetToken,
  hashToken,
};
