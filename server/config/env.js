import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export const port = process.env.PORT || 5000;
export const nodeEnv = process.env.NODE_ENV || 'development';
export const mongoUri = process.env.MONGO_URI;
export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpire = process.env.JWT_EXPIRE || '7d';

export const ai = {
  apiKey: process.env.GROQ_API_KEY,
  model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
};

export const rateLimit = {
  windowMs: parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS, 10) || 60000,
  max: parseInt(process.env.AI_RATE_LIMIT_MAX, 10) || 5,
};

export default {
  port,
  nodeEnv,
  mongoUri,
  jwtSecret,
  jwtExpire,
  ai,
  rateLimit,
};
