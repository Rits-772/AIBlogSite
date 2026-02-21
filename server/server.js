const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Initialize Express
const app = express();

// ---------------------
// Global Middleware
// ---------------------

// CORS — allow frontend origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
if (config.nodeEnv === 'development') {
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
    environment: config.nodeEnv,
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
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║     🖋  Midnight Typewriter API          ║
  ║     Mode: ${config.nodeEnv.padEnd(28)}║
  ║     Port: ${String(PORT).padEnd(28)}║
  ╚══════════════════════════════════════════╝
  `);
});
