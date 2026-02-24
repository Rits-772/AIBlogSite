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

/**
 * @desc    Summarize blog post
 * @route   POST /api/ai/summarize
 * @access  Public
 */
const summarizePost = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }
    const summary = await aiService.summarizePost(content);
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate reply to a comment
 * @route   POST /api/ai/reply
 * @access  Public
 */
const generateReply = async (req, res, next) => {
  try {
    const { postContent, comment } = req.body;
    if (!postContent || !comment) {
      return res.status(400).json({ success: false, message: 'Post context and comment are required' });
    }
    const reply = await aiService.generateReply(postContent, comment);
    res.status(200).json({ success: true, data: reply });
  } catch (error) {
    next(error);
  }
};

module.exports = { generatePost, summarizePost, generateReply };
