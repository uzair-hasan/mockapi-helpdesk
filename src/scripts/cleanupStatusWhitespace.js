/**
 * Cleanup Script: Trim whitespace/newlines from status fields
 * Run: node src/scripts/cleanupStatusWhitespace.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Ticket = require('../models/ticket.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk_mock';

async function cleanup() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected\n');

    // Find all tickets with status containing whitespace/newlines
    const allTickets = await Ticket.find().lean();
    let fixedCount = 0;

    for (const ticket of allTickets) {
      const trimmed = ticket.status.trim();
      if (trimmed !== ticket.status) {
        await Ticket.updateOne(
          { _id: ticket._id },
          { $set: { status: trimmed } }
        );
        console.log(`  Fixed ${ticket.ticketId}: "${ticket.status.replace(/\n/g, '\\n')}" -> "${trimmed}"`);
        fixedCount++;
      }
    }

    if (fixedCount === 0) {
      console.log('All tickets have clean status values. Nothing to fix.');
    } else {
      console.log(`\nFixed ${fixedCount} ticket(s).`);
    }

    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

cleanup();
