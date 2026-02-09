/**
 * Ticket Service
 *
 * Business logic layer for ticket operations.
 * Handles all ticket-related database operations and business rules.
 */

const Ticket = require('../models/ticket.model');

// Helper function to format date as DD/MM/YYYY HH:MMAM/PM
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = String(hours).padStart(2, '0');
  return `${day}/${month}/${year} ${formattedHours}:${minutes}${ampm}`;
}

// Helper function to generate FI code like "FI001", "FI042", etc.
function generateFiCode() {
  const num = Math.floor(Math.random() * 999) + 1;
  return `FI${String(num).padStart(3, '0')}`;
}

// List of sample assignees for auto-population
const SAMPLE_ASSIGNEES = [
  'Helpdesk Team',
  'Technical Support',
  'IT Support Team',
  'Customer Service',
  'Operations Team',
  'System Admin',
  'Network Team'
];

// Helper function to get a random assignee
function getRandomAssignee() {
  return SAMPLE_ASSIGNEES[Math.floor(Math.random() * SAMPLE_ASSIGNEES.length)];
}

// Helper to extract reopening reason from audit trail
function extractReopeningReason(auditTrail) {
  if (!auditTrail || auditTrail.length === 0) return null;
  // Find the latest "Ticket Re-Opened" entry
  const reopenEntry = [...auditTrail].reverse().find(e => e.activity === 'Ticket Re-Opened');
  if (reopenEntry && reopenEntry.remark) {
    return reopenEntry.remark.replace(/^Reason:\s*/, '').trim();
  }
  return null;
}

/**
 * Get tickets with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.limit - Items per page
 * @param {string} params.status - Filter by status
 * @param {string} params.category - Filter by category
 * @param {string} params.search - Search text
 * @param {string} params.sortField - Field to sort by
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @returns {Promise<Object>} Paginated tickets with metadata
 */
async function getTickets({
  page = 1,
  limit = 10,
  status,
  category,
  search,
  sortField = 'createdAt',
  sortOrder = 'desc'
}) {
  const query = {};

  // Apply status filter (supports comma-separated values for multiple statuses)
  if (status && status !== 'All') {
    if (status.includes(',')) {
      // Multiple statuses - use $in operator
      const statuses = status.split(',').map(s => s.trim());
      query.status = { $in: statuses };
    } else {
      query.status = status;
    }
  }

  // Apply category filter
  if (category && category !== 'All') {
    query.category = category;
  }

  // Apply search filter (searches in subject, description, ticketId)
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { subject: searchRegex },
      { description: searchRegex },
      { ticketId: searchRegex },
      { subCategory: searchRegex }
    ];
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Build sort object
  const sort = {};
  sort[sortField] = sortOrder === 'asc' ? 1 : -1;

  // Execute queries
  const [tickets, total] = await Promise.all([
    Ticket.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Ticket.countDocuments(query)
  ]);

  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  return {
    data: tickets,
    total,
    page,
    limit,
    totalPages,
    hasMore,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

/**
 * Get single ticket by ID
 * @param {string} ticketId - Ticket ID
 * @returns {Promise<Object|null>} Ticket or null if not found
 */
async function getTicketById(ticketId) {
  const ticket = await Ticket.findOne({ ticketId }).lean();
  if (ticket && (ticket.status === 'Re-Opened' || ticket.reason)) {
    ticket.reopeningReason = ticket.reason || extractReopeningReason(ticket.auditTrail);
  }
  return ticket;
}

/**
 * Create a new ticket
 * @param {Object} ticketData - Ticket data
 * @returns {Promise<Object>} Created ticket
 */
async function createTicket(ticketData) {
  const [newTicketId, nextSrNo] = await Promise.all([
    Ticket.generateTicketId(),
    Ticket.getNextSrNo()
  ]);

  const now = new Date();
  const formattedDate = formatDate(now);

  // Set default values for initiator-related fields
  const initiatorName = ticketData.initiator || 'User';

  const ticket = new Ticket({
    // Spread user data first (category, subCategory, subject, description, etc.)
    ...ticketData,
    // Then override with generated/default values (these take priority)
    ticketId: newTicketId,
    srNo: nextSrNo,
    raisedOn: formattedDate,
    lastUpdatedOn: formattedDate,
    status: 'Pending',
    initiator: initiatorName,
    raisedBy: ticketData.raisedBy || initiatorName,
    reClientName: ticketData.reClientName || initiatorName,
    fiCode: ticketData.fiCode || generateFiCode(),
    assignedTo: ticketData.assignedTo || getRandomAssignee(),
    documents: ticketData.documents || [],
    auditTrail: [{
      srNo: 1,
      activity: 'Ticket Created',
      date: formattedDate,
      timestamp: now.toISOString(),
      status: 'Pending',
      remark: `Ticket raised for ${ticketData.category} - ${ticketData.subCategory}`,
      documents: ticketData.documents || [],
      userName: initiatorName
    }]
  });

  await ticket.save();
  return ticket.toObject();
}

/**
 * Submit feedback for a resolved ticket
 * @param {string} ticketId - Ticket ID
 * @param {Object} feedback - Feedback data
 * @param {number} feedback.rating - Rating (1-5)
 * @param {string} feedback.feedback - Feedback text
 * @param {Array} feedback.documents - Uploaded documents
 * @returns {Promise<Object>} Updated ticket
 */
async function submitFeedback(ticketId, feedback) {
  const ticket = await Ticket.findOne({ ticketId });

  if (!ticket) {
    throw new Error('Ticket not found');
  }

  if (ticket.status !== 'Resolved') {
    throw new Error('Feedback can only be submitted for resolved tickets');
  }

  const now = new Date();
  const formattedDate = formatDate(now);

  // Update ticket with feedback
  ticket.feedback = {
    rating: feedback.rating,
    comment: feedback.feedback,
    submittedAt: now
  };

  // Transition to Closed
  const previousStatus = ticket.status;
  ticket.status = 'Closed';
  ticket.lastUpdatedOn = formattedDate;

  // Add audit trail entry
  ticket.addAuditTrail({
    activity: 'Feedback Submitted',
    status: 'Closed',
    previousStatus,
    remark: `Rating: ${feedback.rating}/5. ${feedback.feedback || ''}`.trim(),
    documents: feedback.documents || [],
    userName: 'User'
  });

  await ticket.save();
  return {
    ticketId: ticket.ticketId,
    status: ticket.status,
    message: 'Feedback submitted successfully'
  };
}

/**
 * Reopen a resolved ticket
 * @param {string} ticketId - Ticket ID
 * @param {Object} data - Reopen data
 * @param {string} data.reason - Reason for reopening
 * @param {string} data.description - Detailed description
 * @param {Array} data.documents - Uploaded documents
 * @returns {Promise<Object>} Updated ticket
 */
async function reopenTicket(ticketId, data) {
  const ticket = await Ticket.findOne({ ticketId });

  if (!ticket) {
    throw new Error('Ticket not found');
  }

  if (ticket.status !== 'Resolved') {
    throw new Error('Only resolved tickets can be reopened');
  }

  const now = new Date();
  const formattedDate = formatDate(now);

  // Update ticket status
  const previousStatus = ticket.status;
  ticket.status = 'Re-Opened';
  ticket.reason = data.reason;
  ticket.lastUpdatedOn = formattedDate;

  // Add audit trail entry
  ticket.addAuditTrail({
    activity: 'Ticket Re-Opened',
    status: 'Re-Opened',
    previousStatus,
    remark: `Reason: ${data.reason}. ${data.description || ''}`.trim(),
    documents: data.documents || [],
    userName: 'User'
  });

  await ticket.save();
  return {
    ticketId: ticket.ticketId,
    status: ticket.status,
    reopeningReason: data.reason,
    message: 'Ticket reopened successfully'
  };
}

/**
 * Provide clarification for a ticket
 * @param {string} ticketId - Ticket ID
 * @param {Object} data - Clarification data
 * @param {string} data.clarification - Clarification text
 * @param {Array} data.documents - Uploaded documents
 * @returns {Promise<Object>} Updated ticket
 */
async function provideClarification(ticketId, data) {
  const ticket = await Ticket.findOne({ ticketId });

  if (!ticket) {
    throw new Error('Ticket not found');
  }

  if (ticket.status !== 'Clarification Sought') {
    throw new Error('Clarification can only be provided when status is "Clarification Sought"');
  }

  const now = new Date();
  const formattedDate = formatDate(now);

  // Update ticket status
  const previousStatus = ticket.status;
  ticket.status = 'Clarification Provided';
  ticket.lastUpdatedOn = formattedDate;

  // Add audit trail entry
  ticket.addAuditTrail({
    activity: 'Clarification Provided',
    status: 'Clarification Provided',
    previousStatus,
    remark: data.clarification,
    documents: data.documents || [],
    userName: 'User'
  });

  await ticket.save();
  return {
    ticketId: ticket.ticketId,
    status: ticket.status,
    message: 'Clarification provided successfully'
  };
}

/**
 * Get audit trail for a ticket
 * @param {string} ticketId - Ticket ID
 * @returns {Promise<Array>} Audit trail entries
 */
async function getAuditTrail(ticketId) {
  const ticket = await Ticket.findOne({ ticketId }).lean();

  if (!ticket) {
    throw new Error('Ticket not found');
  }

  return ticket.auditTrail || [];
}

/**
 * Update ticket status (Admin action)
 * @param {string} ticketId - Ticket ID
 * @param {Object} data - Update data
 * @param {string} data.status - New status
 * @param {string} data.remarks - Admin remarks
 * @param {Array} data.documents - Uploaded documents
 * @param {string} data.adminUser - Admin username
 * @returns {Promise<Object>} Updated ticket
 */
async function updateTicketStatus(ticketId, data) {
  const ticket = await Ticket.findOne({ ticketId });

  if (!ticket) {
    throw new Error('Ticket not found');
  }

  // Validate status transition
  if (!ticket.isValidTransition(data.status)) {
    throw new Error(`Invalid status transition from "${ticket.status}" to "${data.status}"`);
  }

  const now = new Date();
  const formattedDate = formatDate(now);

  // Update ticket
  const previousStatus = ticket.status;
  ticket.status = data.status;
  ticket.lastUpdatedOn = formattedDate;

  if (data.remarks) {
    ticket.remarks = data.remarks;
  }

  // Map status to activity description
  const activityMap = {
    'Resolved': 'Ticket Resolved',
    'Clarification Sought': 'Clarification Requested',
    'Pending': 'Ticket Status Updated',
    'Re-Opened': 'Ticket Re-Opened',
    'Closed': 'Ticket Closed',
    'Assigned to RE': 'Ticket Assigned to RE',
    'Responded by RE': 'RE Responded'
  };

  // Add audit trail entry
  ticket.addAuditTrail({
    activity: activityMap[data.status] || 'Status Updated',
    status: data.status,
    previousStatus,
    remark: data.remarks || '',
    documents: data.documents || [],
    userName: data.adminUser || 'Admin'
  });

  await ticket.save();
  return {
    ticketId: ticket.ticketId,
    status: ticket.status,
    previousStatus,
    message: `Ticket status updated to "${data.status}"`
  };
}

/**
 * Resolve a ticket (Admin action)
 * @param {string} ticketId - Ticket ID
 * @param {Object} data - Resolution data
 * @returns {Promise<Object>} Updated ticket
 */
async function resolveTicket(ticketId, data) {
  return updateTicketStatus(ticketId, {
    status: 'Resolved',
    remarks: data.remarks || data.resolution,
    documents: data.documents,
    adminUser: data.adminUser || 'Admin'
  });
}

/**
 * Request clarification for a ticket (Admin action)
 * @param {string} ticketId - Ticket ID
 * @param {Object} data - Clarification request data
 * @returns {Promise<Object>} Updated ticket
 */
async function requestClarification(ticketId, data) {
  return updateTicketStatus(ticketId, {
    status: 'Clarification Sought',
    remarks: data.question || data.remarks,
    documents: data.documents,
    adminUser: data.adminUser || 'Admin'
  });
}

/**
 * Get tickets for admin (intervene/track views)
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Paginated tickets with admin fields
 */
async function getAdminTickets(params) {
  const result = await getTickets(params);

  // Add admin-specific computed fields
  result.data = result.data.map(ticket => {
    const enriched = {
      ...ticket,
      ticketAge: calculateTicketAge(ticket.raisedOn)
    };

    // Add reopeningReason from reason field or audit trail
    if (ticket.status === 'Re-Opened' || ticket.reason) {
      enriched.reopeningReason = ticket.reason || extractReopeningReason(ticket.auditTrail);
    }

    return enriched;
  });

  return result;
}

/**
 * Calculate ticket age from raised date
 * @param {string} raisedOn - Date string in DD/MM/YYYY format
 * @returns {string} Age string
 */
function calculateTicketAge(raisedOn) {
  try {
    const parts = raisedOn.split(' ')[0].split('/');
    const raised = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    const now = new Date();
    const diffTime = Math.abs(now - raised);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  } catch {
    return 'N/A';
  }
}

/**
 * Get ticket statistics
 * @returns {Promise<Object>} Statistics object
 */
async function getTicketStats() {
  const [
    total,
    pending,
    resolved,
    clarificationSought,
    reopened,
    closed
  ] = await Promise.all([
    Ticket.countDocuments(),
    Ticket.countDocuments({ status: 'Pending' }),
    Ticket.countDocuments({ status: 'Resolved' }),
    Ticket.countDocuments({ status: 'Clarification Sought' }),
    Ticket.countDocuments({ status: 'Re-Opened' }),
    Ticket.countDocuments({ status: 'Closed' })
  ]);

  return {
    total,
    byStatus: {
      pending,
      resolved,
      clarificationSought,
      reopened,
      closed
    }
  };
}

/**
 * Intervene on a ticket (Admin action)
 * @param {string} ticketId - Ticket ID
 * @param {Object} data - Intervention data
 * @param {string} data.remark - Intervention remark
 * @param {string} data.adminUser - Admin username
 * @returns {Promise<Object>} Updated ticket
 */
async function interveneTicket(ticketId, data) {
  const ticket = await Ticket.findOne({ ticketId });

  if (!ticket) {
    throw new Error('Ticket not found');
  }

  const now = new Date();

  // Add audit trail entry for intervention
  ticket.addAuditTrail({
    activity: 'Admin Intervention',
    status: ticket.status,
    remark: data.remark,
    userName: data.adminUser || 'Admin'
  });

  // Update last updated timestamp
  ticket.lastUpdatedOn = formatDate(now);

  await ticket.save();

  return {
    ticketId: ticket.ticketId,
    status: ticket.status,
    message: 'Intervention recorded successfully'
  };
}

/**
 * Assign ticket to RE or Helpdesk (Admin action)
 * @param {string} ticketId - Ticket ID
 * @param {Object} data - Assignment data
 * @param {string} data.assignTo - 'helpdesk' or 're'
 * @param {string} data.reEntity - RE Name/FI Code (required if assignTo is 're')
 * @param {string} data.remarks - Admin remarks
 * @param {Array} data.documents - Uploaded documents
 * @param {string} data.adminUser - Admin username
 * @returns {Promise<Object>} Updated ticket
 */
async function assignTicket(ticketId, data) {
  const ticket = await Ticket.findOne({ ticketId });

  if (!ticket) {
    throw new Error('Ticket not found');
  }

  const now = new Date();
  const formattedDate = formatDate(now);

  // Update ticket
  const previousStatus = ticket.status;
  ticket.status = 'Assigned to RE';
  ticket.lastUpdatedOn = formattedDate;
  ticket.assignedTo = data.assignTo === 're' ? data.reEntity : 'Helpdesk';

  if (data.remarks) {
    ticket.remarks = data.remarks;
  }

  // Add audit trail entry
  ticket.addAuditTrail({
    activity: data.assignTo === 're' ? 'Assigned to RE' : 'Assigned to Helpdesk',
    status: 'Assigned to RE',
    previousStatus,
    remark: data.remarks || '',
    documents: data.documents || [],
    userName: data.adminUser || 'Admin'
  });

  await ticket.save();
  return {
    ticketId: ticket.ticketId,
    status: ticket.status,
    assignedTo: ticket.assignedTo,
    previousStatus,
    message: `Ticket assigned to ${data.assignTo === 're' ? data.reEntity : 'Helpdesk'} successfully`
  };
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
  interveneTicket,
  assignTicket
};
