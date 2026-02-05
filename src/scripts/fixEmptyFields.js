/**
 * Script to fix tickets with empty reClientName, raisedBy, fiCode, and assignedTo fields
 * Run with: node src/scripts/fixEmptyFields.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Ticket = require('../models/ticket.model');

// Generate a random FI code like "FI001", "FI042", etc.
function generateFiCode() {
  const num = Math.floor(Math.random() * 999) + 1;
  return `FI${String(num).padStart(3, '0')}`;
}

// List of sample assignees
const SAMPLE_ASSIGNEES = [
  'Helpdesk Team',
  'Technical Support',
  'IT Support Team',
  'Customer Service',
  'Operations Team',
  'System Admin',
  'Network Team'
];

function getRandomAssignee() {
  return SAMPLE_ASSIGNEES[Math.floor(Math.random() * SAMPLE_ASSIGNEES.length)];
}

async function fixEmptyFields() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk-mock';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find tickets with empty reClientName, raisedBy, fiCode, or assignedTo
    const ticketsToFix = await Ticket.find({
      $or: [
        { reClientName: '' },
        { reClientName: { $exists: false } },
        { raisedBy: '' },
        { raisedBy: { $exists: false } },
        { fiCode: '' },
        { fiCode: { $exists: false } },
        { assignedTo: '' },
        { assignedTo: { $exists: false } }
      ]
    });

    console.log(`Found ${ticketsToFix.length} tickets to fix`);

    // Update each ticket
    for (const ticket of ticketsToFix) {
      const initiatorName = ticket.initiator || 'User';

      const updateFields = {};

      if (!ticket.reClientName) {
        updateFields.reClientName = initiatorName;
      }

      if (!ticket.raisedBy) {
        updateFields.raisedBy = initiatorName;
      }

      if (!ticket.fiCode) {
        updateFields.fiCode = generateFiCode();
      }

      if (!ticket.assignedTo) {
        updateFields.assignedTo = getRandomAssignee();
      }

      if (Object.keys(updateFields).length > 0) {
        await Ticket.updateOne(
          { _id: ticket._id },
          { $set: updateFields }
        );
        console.log(`Fixed ticket ${ticket.ticketId}: reClientName="${updateFields.reClientName || ticket.reClientName}", raisedBy="${updateFields.raisedBy || ticket.raisedBy}", fiCode="${updateFields.fiCode || ticket.fiCode}", assignedTo="${updateFields.assignedTo || ticket.assignedTo}"`);
      }
    }

    console.log('Done fixing tickets!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixEmptyFields();
