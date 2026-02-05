/**
 * Routes Index
 *
 * Central router configuration.
 * Aggregates all route modules.
 */

const express = require('express');
const ticketRoutes = require('./ticket.routes');
const adminRoutes = require('./admin.routes');
const reRoutes = require('./re.routes');

const router = express.Router();

// API health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Helpdesk Mock API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount route modules
router.use('/tickets', ticketRoutes);
router.use('/admin', adminRoutes);
router.use('/re', reRoutes);

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    meta: {
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;
