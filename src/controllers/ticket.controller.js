/**
 * Ticket Controller
 *
 * HTTP request handlers for ticket operations.
 * Maps HTTP requests to service layer methods.
 */

const ticketService = require('../services/ticket.service');

/**
 * Helper to send success response
 */
function sendSuccess(res, data, message = 'Success', statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    data,
    message,
    meta: {
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * Helper to send error response
 */
function sendError(res, error, statusCode = 500) {
  console.error('API Error:', error.message);
  res.status(statusCode).json({
    success: false,
    error: error.message || 'Internal server error',
    message: error.message || 'An error occurred',
    meta: {
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * GET /api/tickets
 * Get tickets with pagination and filters
 */
async function getTickets(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
      sortField,
      sortOrder
    } = req.query;

    console.log('📋 GET /api/tickets', { page, limit, status, category, search });

    const result = await ticketService.getTickets({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      status,
      category,
      search,
      sortField,
      sortOrder
    });

    sendSuccess(res, result, 'Tickets retrieved successfully');
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * GET /api/tickets/:ticketId
 * Get single ticket by ID
 */
async function getTicketById(req, res) {
  try {
    const { ticketId } = req.params;

    console.log('🎫 GET /api/tickets/:ticketId', { ticketId });

    const ticket = await ticketService.getTicketById(ticketId);

    if (!ticket) {
      return sendError(res, new Error('Ticket not found'), 404);
    }

    sendSuccess(res, ticket, 'Ticket retrieved successfully');
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * POST /api/tickets
 * Create a new ticket
 */
async function createTicket(req, res) {
  try {
    const ticketData = req.body;

    console.log('➕ POST /api/tickets', ticketData);

    // Validate required fields
    const requiredFields = ['category', 'subCategory', 'subject', 'description'];
    const missingFields = requiredFields.filter(field => !ticketData[field]);

    if (missingFields.length > 0) {
      return sendError(
        res,
        new Error(`Missing required fields: ${missingFields.join(', ')}`),
        400
      );
    }

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      ticketData.documents = req.files.map(file => ({
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.originalname,
        type: getFileType(file.mimetype),
        size: file.size,
        url: `/uploads/${file.originalname}`
      }));
    }

    const ticket = await ticketService.createTicket(ticketData);

    sendSuccess(res, ticket, 'Ticket created successfully', 201);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * POST /api/tickets/:ticketId/feedback
 * Submit feedback for a resolved ticket
 */
async function submitFeedback(req, res) {
  try {
    const { ticketId } = req.params;
    const feedbackData = req.body;

    console.log('⭐ POST /api/tickets/:ticketId/feedback', { ticketId, feedbackData });

    // Validate rating
    if (!feedbackData.rating || feedbackData.rating < 1 || feedbackData.rating > 5) {
      return sendError(res, new Error('Rating must be between 1 and 5'), 400);
    }

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      feedbackData.documents = req.files.map(file => ({
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.originalname,
        type: getFileType(file.mimetype),
        size: file.size,
        url: `/uploads/${file.filename}`
      }));
    }

    const result = await ticketService.submitFeedback(ticketId, feedbackData);

    sendSuccess(res, result, 'Feedback submitted successfully');
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error, 404);
    }
    if (error.message.includes('only be submitted')) {
      return sendError(res, error, 400);
    }
    sendError(res, error);
  }
}

/**
 * POST /api/tickets/:ticketId/reopen
 * Reopen a resolved ticket
 */
async function reopenTicket(req, res) {
  try {
    const { ticketId } = req.params;
    const reopenData = req.body;

    console.log('🔄 POST /api/tickets/:ticketId/reopen', { ticketId, reopenData });

    // Validate required fields
    if (!reopenData.reason) {
      return sendError(res, new Error('Reason is required to reopen a ticket'), 400);
    }

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      reopenData.documents = req.files.map(file => ({
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.originalname,
        type: getFileType(file.mimetype),
        size: file.size,
        url: `/uploads/${file.filename}`
      }));
    }

    const result = await ticketService.reopenTicket(ticketId, reopenData);

    sendSuccess(res, result, 'Ticket reopened successfully');
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error, 404);
    }
    if (error.message.includes('Only resolved')) {
      return sendError(res, error, 400);
    }
    sendError(res, error);
  }
}

/**
 * POST /api/tickets/:ticketId/clarification
 * Provide clarification for a ticket
 */
async function provideClarification(req, res) {
  try {
    const { ticketId } = req.params;
    const clarificationData = req.body;

    console.log('💬 POST /api/tickets/:ticketId/clarification', { ticketId, clarificationData });

    // Validate required fields
    if (!clarificationData.clarification) {
      return sendError(res, new Error('Clarification text is required'), 400);
    }

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      clarificationData.documents = req.files.map(file => ({
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.originalname,
        type: getFileType(file.mimetype),
        size: file.size,
        url: `/uploads/${file.filename}`
      }));
    }

    const result = await ticketService.provideClarification(ticketId, clarificationData);

    sendSuccess(res, result, 'Clarification provided successfully');
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error, 404);
    }
    if (error.message.includes('only be provided')) {
      return sendError(res, error, 400);
    }
    sendError(res, error);
  }
}

/**
 * GET /api/tickets/:ticketId/audit-trail
 * Get audit trail for a ticket
 */
async function getAuditTrail(req, res) {
  try {
    const { ticketId } = req.params;

    console.log('📜 GET /api/tickets/:ticketId/audit-trail', { ticketId });

    const auditTrail = await ticketService.getAuditTrail(ticketId);

    sendSuccess(res, auditTrail, 'Audit trail retrieved successfully');
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error, 404);
    }
    sendError(res, error);
  }
}

/**
 * PATCH /api/tickets/:ticketId/status
 * Update ticket status (Admin)
 */
async function updateTicketStatus(req, res) {
  try {
    const { ticketId } = req.params;
    const updateData = req.body;

    console.log('📝 PATCH /api/tickets/:ticketId/status', { ticketId, updateData });

    // Validate required fields
    if (!updateData.status) {
      return sendError(res, new Error('New status is required'), 400);
    }

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      updateData.documents = req.files.map(file => ({
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.originalname,
        type: getFileType(file.mimetype),
        size: file.size,
        url: `/uploads/${file.filename}`
      }));
    }

    const result = await ticketService.updateTicketStatus(ticketId, updateData);

    sendSuccess(res, result, `Ticket status updated to "${updateData.status}"`);
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error, 404);
    }
    if (error.message.includes('Invalid status')) {
      return sendError(res, error, 400);
    }
    sendError(res, error);
  }
}

/**
 * POST /api/tickets/:ticketId/resolve
 * Resolve a ticket (Admin)
 */
async function resolveTicket(req, res) {
  try {
    const { ticketId } = req.params;
    const resolveData = req.body;

    console.log('✅ POST /api/tickets/:ticketId/resolve', { ticketId, resolveData });

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      resolveData.documents = req.files.map(file => ({
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.originalname,
        type: getFileType(file.mimetype),
        size: file.size,
        url: `/uploads/${file.filename}`
      }));
    }

    const result = await ticketService.resolveTicket(ticketId, resolveData);

    sendSuccess(res, result, 'Ticket resolved successfully');
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error, 404);
    }
    if (error.message.includes('Invalid status')) {
      return sendError(res, error, 400);
    }
    sendError(res, error);
  }
}

/**
 * POST /api/tickets/:ticketId/request-clarification
 * Request clarification for a ticket (Admin)
 */
async function requestClarification(req, res) {
  try {
    const { ticketId } = req.params;
    const clarificationData = req.body;

    console.log('❓ POST /api/tickets/:ticketId/request-clarification', { ticketId, clarificationData });

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      clarificationData.documents = req.files.map(file => ({
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.originalname,
        type: getFileType(file.mimetype),
        size: file.size,
        url: `/uploads/${file.filename}`
      }));
    }

    const result = await ticketService.requestClarification(ticketId, clarificationData);

    sendSuccess(res, result, 'Clarification requested successfully');
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error, 404);
    }
    if (error.message.includes('Invalid status')) {
      return sendError(res, error, 400);
    }
    sendError(res, error);
  }
}

/**
 * GET /api/admin/tickets
 * Get tickets for admin views (intervene/track)
 */
async function getAdminTickets(req, res) {
  try {
    const params = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
      status: req.query.status,
      category: req.query.category,
      search: req.query.search,
      sortField: req.query.sortField,
      sortOrder: req.query.sortOrder
    };

    console.log('👤 GET /api/admin/tickets', params);

    const result = await ticketService.getAdminTickets(params);

    sendSuccess(res, result, 'Admin tickets retrieved successfully');
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * GET /api/tickets/stats
 * Get ticket statistics
 */
async function getTicketStats(req, res) {
  try {
    console.log('📊 GET /api/tickets/stats');

    const stats = await ticketService.getTicketStats();

    sendSuccess(res, stats, 'Statistics retrieved successfully');
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * POST /api/admin/tickets/:ticketId/intervene
 * Admin intervention on a ticket
 */
async function interveneTicket(req, res) {
  try {
    const { ticketId } = req.params;
    const { remark } = req.body;

    console.log('🔧 POST /api/admin/tickets/:ticketId/intervene', { ticketId, remark });

    // Validate remark
    if (!remark || remark.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Remark is required',
        message: 'Remark is required'
      });
    }

    const result = await ticketService.interveneTicket(ticketId, {
      remark: remark.trim(),
      adminUser: req.body.adminUser || 'Admin'
    });

    sendSuccess(res, result, 'Intervention recorded successfully');
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * POST /api/tickets/:ticketId/assign
 * Assign ticket to RE or Helpdesk (Admin)
 */
async function assignTicket(req, res) {
  try {
    const { ticketId } = req.params;
    const assignData = req.body;

    console.log('📌 POST /api/tickets/:ticketId/assign', { ticketId, assignData });

    // Validate required fields
    if (!assignData.assignTo) {
      return sendError(res, new Error('assignTo is required (helpdesk or re)'), 400);
    }

    if (assignData.assignTo === 're' && !assignData.reEntity) {
      return sendError(res, new Error('RE Entity is required when assigning to RE'), 400);
    }

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      assignData.documents = req.files.map(file => ({
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.originalname,
        type: getFileType(file.mimetype),
        size: file.size,
        url: `/uploads/${file.filename}`
      }));
    }

    const result = await ticketService.assignTicket(ticketId, assignData);

    sendSuccess(res, result, 'Ticket assigned successfully');
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error, 404);
    }
    sendError(res, error);
  }
}

/**
 * GET /api/tickets/:ticketId/download/:documentId
 * Download a document attachment
 */
async function downloadDocument(req, res) {
  try {
    const { ticketId, documentId } = req.params;

    console.log('📥 GET /api/tickets/:ticketId/download/:documentId', { ticketId, documentId });

    // For mock purposes, return a placeholder response
    // In real implementation, this would fetch the file from storage
    res.json({
      success: true,
      message: 'Document download endpoint - mock implementation',
      data: {
        ticketId,
        documentId,
        downloadUrl: `/uploads/${documentId}`
      }
    });
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Helper to determine file type from mime type
 */
function getFileType(mimeType) {
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('image')) return 'image';
  if (mimeType.includes('video')) return 'video';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
  if (mimeType.includes('json')) return 'json';
  return 'document';
}

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  submitFeedback,
  reopenTicket,
  provideClarification,
  getAuditTrail,
  updateTicketStatus,
  resolveTicket,
  requestClarification,
  getAdminTickets,
  getTicketStats,
  downloadDocument,
  interveneTicket,
  assignTicket
};
