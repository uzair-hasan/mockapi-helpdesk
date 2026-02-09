/**
 * Ticket Model
 *
 * MongoDB schema for Helpdesk tickets.
 * Matches frontend types from TicketManagement/types/Ticket.types.ts
 */

const mongoose = require('mongoose');

// Document/Attachment sub-schema
const DocumentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['pdf', 'image', 'document', 'video', 'spreadsheet', 'json', 'other'],
    default: 'document'
  },
  size: {
    type: Number,
    default: 0
  },
  url: {
    type: String,
    default: ''
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Audit Trail sub-schema
const AuditTrailSchema = new mongoose.Schema({
  srNo: {
    type: Number,
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  timestamp: {
    type: String
  },
  status: {
    type: String,
    enum: [
      'Pending',
      'Resolved',
      'Clarification Sought',
      'Clarification Provided',
      'Re-Opened',
      'Responded by RE',
      'Assigned to RE',
      'Closed'
    ]
  },
  previousStatus: {
    type: String,
    enum: [
      'Pending',
      'Resolved',
      'Clarification Sought',
      'Clarification Provided',
      'Re-Opened',
      'Responded by RE',
      'Assigned to RE',
      'Closed'
    ]
  },
  remark: {
    type: String,
    default: ''
  },
  supportingDocument: {
    type: String,
    default: ''
  },
  documents: [DocumentSchema],
  userId: {
    type: String
  },
  userName: {
    type: String
  }
}, { _id: false });

// Contact Info sub-schema
const ContactInfoSchema = new mongoose.Schema({
  email: {
    type: String
  },
  phone: {
    type: String
  },
  name: {
    type: String
  }
}, { _id: false });

// SLA sub-schema
const SLASchema = new mongoose.Schema({
  dueDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['On Track', 'At Risk', 'Breached'],
    default: 'On Track'
  }
}, { _id: false });

// Main Ticket Schema
const TicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  srNo: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Technical',
      'Operational',
      'Functional',
      'Miscellaneous',
      'CERSAI-CKYC Level Queries'
    ]
  },
  subCategory: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  status: {
    type: String,
    required: true,
    enum: [
      'Pending',
      'Resolved',
      'Clarification Sought',
      'Clarification Provided',
      'Re-Opened',
      'Responded by RE',
      'Assigned to RE',
      'Closed'
    ],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  raisedOn: {
    type: String,
    required: true
  },
  lastUpdatedOn: {
    type: String,
    required: true
  },
  supportingDocument: {
    type: String,
    default: ''
  },
  reason: {
    type: String
  },
  remarks: {
    type: String,
    maxlength: 200
  },
  auditTrail: {
    type: [AuditTrailSchema],
    default: []
  },
  contactInfo: ContactInfoSchema,
  tags: {
    type: [String],
    default: []
  },
  relatedTickets: {
    type: [String],
    default: []
  },
  sla: SLASchema,
  // Admin-specific fields
  initiator: {
    type: String
  },
  assignedTo: {
    type: String
  },
  ticketAge: {
    type: String
  },
  // RE/Client and FI fields
  reClientName: {
    type: String,
    default: ''
  },
  fiCode: {
    type: String,
    default: ''
  },
  raisedBy: {
    type: String,
    default: ''
  },
  // Top-level documents for ticket attachments
  documents: {
    type: [DocumentSchema],
    default: []
  },
  // Feedback fields
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    },
    submittedAt: {
      type: Date
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
TicketSchema.index({ status: 1 });
TicketSchema.index({ category: 1 });
TicketSchema.index({ priority: 1 });
TicketSchema.index({ raisedOn: -1 });
TicketSchema.index({ createdAt: -1 });

// Virtual for ticket age calculation
TicketSchema.virtual('calculatedTicketAge').get(function() {
  const raised = new Date(this.raisedOn.split('/').reverse().join('-'));
  const now = new Date();
  const diffTime = Math.abs(now - raised);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} days`;
});

// Pre-save middleware to update lastUpdatedOn
TicketSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.lastUpdatedOn = formatDate(new Date());
  }
  next();
});

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

// Static method to generate next ticket ID
TicketSchema.statics.generateTicketId = async function() {
  // Find the highest numeric ticket ID (skip non-numeric IDs like TKT100001)
  const tickets = await this.find().select('ticketId').lean();

  if (!tickets || tickets.length === 0) {
    return '7654567897'; // Starting ticket ID
  }

  let maxNumericId = 0;
  for (const t of tickets) {
    const num = parseInt(t.ticketId, 10);
    if (!isNaN(num) && num > maxNumericId) {
      maxNumericId = num;
    }
  }

  // If no numeric IDs found, start fresh
  if (maxNumericId === 0) {
    return '7654567897';
  }

  return String(maxNumericId + 1);
};

// Static method to get next srNo
TicketSchema.statics.getNextSrNo = async function() {
  const lastTicket = await this.findOne().sort({ srNo: -1 });
  return lastTicket ? lastTicket.srNo + 1 : 1;
};

// Instance method to add audit trail entry
TicketSchema.methods.addAuditTrail = function(entry) {
  const nextSrNo = this.auditTrail.length + 1;
  this.auditTrail.push({
    srNo: nextSrNo,
    date: formatDate(new Date()),
    timestamp: new Date().toISOString(),
    ...entry
  });
};

// Instance method to check if status transition is valid
TicketSchema.methods.isValidTransition = function(newStatus) {
  const validTransitions = {
    'Pending': ['Resolved', 'Clarification Sought', 'Re-Opened'],
    'Resolved': ['Re-Opened', 'Closed'],
    'Clarification Sought': ['Resolved', 'Re-Opened', 'Clarification Provided'],
    'Clarification Provided': ['Resolved', 'Clarification Sought', 'Pending'],
    'Re-Opened': ['Resolved', 'Clarification Sought', 'Pending'],
    'Responded by RE': ['Resolved', 'Clarification Sought', 'Pending'],
    'Assigned to RE': ['Resolved', 'Clarification Sought', 'Pending'],
    'Closed': [] // No transitions allowed from Closed
  };

  const currentStatus = this.status;
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;
