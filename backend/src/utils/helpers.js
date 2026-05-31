/**
 * Pagination Helper
 */
export const getPaginationParams = (page = 1, limit = 20) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(
    parseInt(limit) || 20,
    parseInt(process.env.MAX_LIMIT || 100)
  );
  const skip = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, skip };
};

/**
 * Pagination Response Format
 */
export const paginationResponse = (data, page, limit, total) => {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

/**
 * Success Response Format
 */
export const successResponse = (message, data = null, statusCode = 200) => {
  return {
    statusCode,
    success: true,
    message,
    data,
  };
};

/**
 * Error Response Format
 */
export const errorResponse = (message, statusCode = 500, errors = null) => {
  return {
    statusCode,
    success: false,
    message,
    ...(errors && { errors }),
  };
};

/**
 * Extract search keywords
 */
export const extractSearchKeywords = (text) => {
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2);
};

export default {
  getPaginationParams,
  paginationResponse,
  successResponse,
  errorResponse,
  extractSearchKeywords,
};
