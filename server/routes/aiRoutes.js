import express from 'express';
import { body } from 'express-validator';
import { generatePost, summarizePost, generateReply } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/ai/generate
router.post(
  '/generate',
  aiLimiter,
  [
    body('topic')
      .trim()
      .notEmpty()
      .withMessage('Topic is required')
      .isLength({ max: 200 })
      .withMessage('Topic cannot exceed 200 characters'),
    body('tone')
      .optional()
      .trim()
      .isIn([
        'formal',
        'casual',
        'thoughtful',
        'humorous',
        'persuasive',
        'academic',
        'narrative',
        'contemplative',
        'analytical',
        'conversational',
        'provocative',
        'lyrical'
      ])
      .withMessage('Invalid tone selected'),
    body('wordCount')
      .optional()
      .isInt({ min: 100, max: 3000 })
      .withMessage('Word count must be between 100 and 3000'),
  ],
  generatePost
);

// POST /api/ai/summarize
router.post('/summarize', aiLimiter, summarizePost);

// POST /api/ai/reply
router.post('/reply', aiLimiter, generateReply);

export default router;
