/**
 * Admin Routes
 *
 * API routes for admin-specific operations.
 * Supports admin views like intervene and track status.
 */

const express = require('express');
const ticketController = require('../controllers/ticket.controller');

const router = express.Router();

/**
 * Admin ticket management routes
 */

// GET /api/admin/tickets - Get tickets for admin views (with admin-specific fields)
router.get('/tickets', ticketController.getAdminTickets);

// GET /api/admin/tickets/intervene - Get tickets requiring intervention
router.get('/tickets/intervene', (req, res) => {
  // Add filter for intervention-needed tickets
  req.query.status = req.query.status || 'Re-Opened,Clarification Provided';
  ticketController.getAdminTickets(req, res);
});

// GET /api/admin/tickets/track - Get all tickets for tracking
router.get('/tickets/track', ticketController.getAdminTickets);

// GET /api/admin/stats - Get admin statistics
router.get('/stats', ticketController.getTicketStats);

// POST /api/admin/tickets/:ticketId/intervene - Admin intervention
router.post('/tickets/:ticketId/intervene', ticketController.interveneTicket);

module.exports = router;
