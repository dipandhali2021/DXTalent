import { body, param, query, validationResult } from 'express-validator';

/**
 * Validation rules for generating lesson structure
 */
export const validateGenerateLessonStructure = [
  body('topic')
    .trim()
    .notEmpty()
    .withMessage('Topic is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Topic must be between 3 and 200 characters'),

  body('difficulty')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];

/**
 * Validation rules for lesson ID parameter
 */
export const validateLessonId = [
  param('lessonId')
    .trim()
    .notEmpty()
    .withMessage('Lesson ID is required')
    .isMongoId()
    .withMessage('Invalid lesson ID format'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];

/**
 * Validation rules for lesson query filters
 */
export const validateLessonQuery = [
  query('category')
    .optional()
    .trim()
    .isIn(['Marketing', 'Development', 'Data', 'Business', 'Design', 'Other'])
    .withMessage('Invalid category'),

  query('difficulty')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Invalid difficulty level'),

  query('isFullyGenerated')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isFullyGenerated must be true or false'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  },
];
