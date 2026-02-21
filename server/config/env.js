const dotenv = require('dotenv');
const path = require('path');

// Load .env from server directory
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  ai: {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
  },
  rateLimit: {
    windowMs: parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS, 10) || 60000,
    max: parseInt(process.env.AI_RATE_LIMIT_MAX, 10) || 5,
  },
};
