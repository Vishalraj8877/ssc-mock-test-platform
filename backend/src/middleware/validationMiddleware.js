import { body, validationResult } from 'express-validator';

/**
 * Validation result handler
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Auth validation rules
 */
export const authValidationRules = () => [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

/**
 * Question validation rules
 */
export const questionValidationRules = () => [
  body('questionText')
    .trim()
    .notEmpty()
    .withMessage('Question text is required'),
  body('optionA')
    .trim()
    .notEmpty()
    .withMessage('Option A is required'),
  body('optionB')
    .trim()
    .notEmpty()
    .withMessage('Option B is required'),
  body('optionC')
    .trim()
    .notEmpty()
    .withMessage('Option C is required'),
  body('optionD')
    .trim()
    .notEmpty()
    .withMessage('Option D is required'),
  body('correctAnswer')
    .notEmpty()
    .withMessage('Correct answer is required')
    .isIn(['A', 'B', 'C', 'D'])
    .withMessage('Correct answer must be A, B, C, or D'),
  body('subject')
    .notEmpty()
    .withMessage('Subject is required'),
  body('topic')
    .notEmpty()
    .withMessage('Topic is required'),
];

/**
 * Test validation rules
 */
export const testValidationRules = () => [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Test title is required'),
  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 minute'),
  body('totalQuestions')
    .notEmpty()
    .withMessage('Total questions is required')
    .isInt({ min: 1 })
    .withMessage('Total questions must be at least 1'),
  body('testType')
    .notEmpty()
    .withMessage('Test type is required')
    .isIn(['Random', 'TopicWise', 'SubjectWise', 'FullLength', 'PreviousYear'])
    .withMessage('Invalid test type'),
];

export default {
  handleValidationErrors,
  authValidationRules,
  questionValidationRules,
  testValidationRules,
};
