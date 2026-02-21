const { validationResult } = require('express-validator');
const aiService = require('../services/aiService');

/**
 * @desc    Generate AI blog post draft
 * @route   POST /api/ai/generate
 * @access  Public (for demo simplicity, normally would verify Supabase JWT)
 */
const generatePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { topic, tone, wordCount } = req.body;

    // Generate content via AI service
    const draft = await aiService.generateBlogPost({ topic, tone, wordCount });

    res.status(200).json({
      success: true,
      data: draft,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generatePost };
