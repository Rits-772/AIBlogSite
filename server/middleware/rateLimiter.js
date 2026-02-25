const rateLimit = require('express-rate-limit');
const config = require('../config/env');

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * AI endpoint rate limiter (tighter limits)
 * Uses config.rateLimit from server/config/env.js
 */
const aiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs || 60 * 1000, // default fallback
  max: config.rateLimit.max || 5, // default fallback: 5 requests per window
  message: {
    success: false,
    message: 'Too many AI requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth endpoint rate limiter (prevent brute force)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, aiLimiter, authLimiter };
