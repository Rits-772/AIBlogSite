import express, { json, urlencoded } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { nodeEnv, port } from './config/env.js';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Initialize Express
const app = express();
const API = import.meta.env.VITE_API_URL;

// trust proxy (required when running behind Render / other proxies)
app.set('trust proxy', 1);

// --- debug: log which MONGO_URI the process sees (temporary — remove in prod)
console.log('MONGO_URI =', process.env.MONGO_URI);

// ensure DB connection happens on startup
import connectDB from './config/db.js';
connectDB();
// ---------------------
// Global Middleware
// ---------------------

// CORS — allow frontend origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || `${API}`,
    credentials: true,
  })
);

// Body parsers
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true }));

// Request logging
if (nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// General rate limiter
app.use('/api', apiLimiter);

// ---------------------
// API Routes
// ---------------------
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Midnight Typewriter API is running',
    environment: nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use(errorHandler);

// ---------------------
// Start Server
// ---------------------
const PORT = port;

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║     🖋  Midnight Typewriter API          ║
  ║     Mode: ${nodeEnv.padEnd(28)}   ║
  ║     Port: ${String(PORT).padEnd(28)}     ║
  ╚══════════════════════════════════════════╝
  `);
});
