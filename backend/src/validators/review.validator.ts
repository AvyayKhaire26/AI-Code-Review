import { body, param, query } from 'express-validator';
import { Language, Severity } from '../entities/Review.entity';

export const createReviewValidator = [
  body('codeSnippet')
    .notEmpty().withMessage('Code snippet is required')
    .isLength({ max: 10000 }).withMessage('Code snippet must not exceed 10,000 characters'),
  
  body('language')
    .notEmpty().withMessage('Language is required')
    .isIn(Object.values(Language)).withMessage('Invalid language'),
  
  body('customPrompt')
    .optional()
    .isLength({ max: 500 }).withMessage('Custom prompt must not exceed 500 characters')
];

export const reviewIdValidator = [
  param('id')
    .isInt({ min: 0 }).withMessage('Review ID must be a positive integer')
];

export const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 0 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('language')
    .optional()
    .isIn(Object.values(Language)).withMessage('Invalid language'),
  
  query('severity')
    .optional()
    .isIn(Object.values(Severity)).withMessage('Invalid severity')
];
