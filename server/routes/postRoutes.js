import express from 'express';
import { body } from 'express-validator';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/my', protect, getMyPosts); // Must be before /:id
router.get('/:id', getPost);

// Protected routes
router.post(
  '/',
  protect,
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('content').notEmpty().withMessage('Content is required'),
    body('status')
      .optional()
      .isIn(['draft', 'published'])
      .withMessage('Status must be either draft or published'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('category').optional().trim(),
  ],
  createPost
);

router.put(
  '/:id',
  protect,
  [
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('content').optional(),
    body('status')
      .optional()
      .isIn(['draft', 'published'])
      .withMessage('Status must be either draft or published'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('category').optional().trim(),
  ],
  updatePost
);

router.delete('/:id', protect, deletePost);

export default router;
