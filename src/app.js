/**
 * Express Application Configuration
 *
 * Sets up Express app with middleware and routes.
 * This file configures the application but does not start the server.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');

// Create Express app
const app = express();

// Trust proxy for proper IP detection behind reverse proxies
app.set('trust proxy', 1);

/**
 * CORS Configuration
 * Allows requests from any origin (mock API for development teams)
 */
const corsOptions = {
  origin: true, // Allow all origins for mock API
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Disposition']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

/**
 * Request logging
 * Uses morgan with custom format in development
 */
if (process.env.NODE_ENV !== 'test') {
  const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(morganFormat));
}

/**
 * Body parsing middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Static file serving for uploads
 */
const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(path.resolve(uploadDir)));

/**
 * Request logging middleware
 * Logs all incoming requests with payload info
 */
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
    console.log('\n📨 Request Payload:', JSON.stringify(req.body, null, 2));
  }
  next();
});

/**
 * Response logging middleware
 * Logs response status and timing
 */
app.use((req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusIcon = res.statusCode < 400 ? '✅' : '❌';
    console.log(`${statusIcon} ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });

  next();
});

/**
 * API Routes
 * All routes are prefixed with /api
 */
app.use('/api', routes);

/**
 * Root endpoint
 * Returns API information
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Helpdesk Mock Backend',
    version: '1.0.0',
    description: 'Mock backend for Helpdesk/Ticket Management system',
    endpoints: {
      health: '/api/health',
      tickets: '/api/tickets',
      admin: '/api/admin'
    },
    documentation: '/api/docs'
  });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error('🚨 Unhandled Error:', err);

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: messages.join(', '),
      details: messages
    });
  }

  // Handle Mongoose cast errors (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      message: `Invalid ${err.path}: ${err.value}`
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: 'Duplicate Entry',
      message: `${field} already exists`
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.stack : 'An error occurred'
  });
});

/**
 * 404 handler for non-API routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

module.exports = app;
