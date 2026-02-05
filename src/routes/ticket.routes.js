/**
 * Ticket Routes
 *
 * API routes for ticket operations.
 * Maps to frontend ticketService.ts expected endpoints.
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const ticketController = require('../controllers/ticket.controller');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allowed file types matching frontend validation
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/json',
    'video/mp4'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
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
 * User-facing ticket routes
 * These match the frontend ticketService.ts expected endpoints
 */

// GET /api/tickets - List tickets with pagination and filters
router.get('/', ticketController.getTickets);

// GET /api/tickets/stats - Get ticket statistics
router.get('/stats', ticketController.getTicketStats);

// GET /api/tickets/:ticketId - Get single ticket by ID
router.get('/:ticketId', ticketController.getTicketById);

// POST /api/tickets - Create new ticket
router.post('/', handleUpload('documents'), ticketController.createTicket);

// POST /api/tickets/:ticketId/feedback - Submit feedback
router.post(
  '/:ticketId/feedback',
  handleUpload('documents'),
  ticketController.submitFeedback
);

// POST /api/tickets/:ticketId/reopen - Reopen ticket
router.post(
  '/:ticketId/reopen',
  handleUpload('documents'),
  ticketController.reopenTicket
);

// POST /api/tickets/:ticketId/clarification - Provide clarification
router.post(
  '/:ticketId/clarification',
  handleUpload('documents'),
  ticketController.provideClarification
);

// GET /api/tickets/:ticketId/audit-trail - Get audit trail
router.get('/:ticketId/audit-trail', ticketController.getAuditTrail);

// GET /api/tickets/:ticketId/download/:documentId - Download document
router.get('/:ticketId/download/:documentId', ticketController.downloadDocument);

/**
 * Admin-specific ticket routes
 */

// PATCH /api/tickets/:ticketId/status - Update ticket status
router.patch(
  '/:ticketId/status',
  handleUpload('documents'),
  ticketController.updateTicketStatus
);

// POST /api/tickets/:ticketId/resolve - Resolve ticket
router.post(
  '/:ticketId/resolve',
  handleUpload('documents'),
  ticketController.resolveTicket
);

// POST /api/tickets/:ticketId/request-clarification - Request clarification
router.post(
  '/:ticketId/request-clarification',
  handleUpload('documents'),
  ticketController.requestClarification
);

// POST /api/tickets/:ticketId/assign - Assign ticket to RE or Helpdesk
router.post(
  '/:ticketId/assign',
  handleUpload('documents'),
  ticketController.assignTicket
);

module.exports = router;
