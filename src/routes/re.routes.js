/**
 * RE (Relationship Executive) Routes
 *
 * API routes for RE-specific operations.
 * Supports RE views like ticket list and ticket details.
 */

const express = require('express');
const multer = require('multer');
const ticketController = require('../controllers/ticket.controller');

const router = express.Router();

// Configure multer for file uploads (memoryStorage for cloud compatibility)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024 // 5MB default
  }
});

// Middleware to handle multer errors
const handleUpload = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: 'File too large. Maximum size is 5MB',
            message: 'File too large. Maximum size is 5MB'
          });
        }
        return res.status(400).json({
          success: false,
          error: err.message,
          message: err.message
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          error: err.message,
          message: err.message
        });
      }
      next();
    });
  };
};

/**
 * RE ticket management routes
 */

// GET /api/re/tickets - Get tickets for RE user views
router.get('/tickets', ticketController.getAdminTickets);

// GET /api/re/tickets/:ticketId - Get single ticket details for RE
router.get('/tickets/:ticketId', ticketController.getTicketById);

// POST /api/re/tickets/:ticketId/resolve - RE resolves a ticket
router.post(
  '/tickets/:ticketId/resolve',
  handleUpload('documents'),
  ticketController.resolveTicket
);

// POST /api/re/tickets/:ticketId/seek-clarification - RE seeks clarification from initiator
router.post(
  '/tickets/:ticketId/seek-clarification',
  handleUpload('documents'),
  ticketController.requestClarification
);

module.exports = router;
