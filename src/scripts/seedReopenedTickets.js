/**
 * Seed Re-Opened Tickets for Live Demo
 * Run: node src/scripts/seedReopenedTickets.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Ticket = require('../models/ticket.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk_mock';

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

const now = new Date();

const tickets = [
  {
    ticketId: 'TKT200001',
    srNo: 201,
    category: 'Technical',
    subCategory: 'SFTP',
    subject: 'SFTP File Transfer Failing Intermittently',
    description: 'Files failing to upload via SFTP. Issue was marked resolved but problem persists.',
    status: 'Re-Opened',
    priority: 'High',
    reason: 'Issue not Resolved',
    raisedOn: formatDate(new Date(now - 5 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formatDate(new Date(now - 2 * 60 * 60 * 1000)),
    initiator: 'Rahul Mehta',
    raisedBy: 'Rahul Mehta',
    reClientName: 'Rahul Mehta',
    fiCode: 'FI055',
    assignedTo: 'Network Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(new Date(now - 5 * 24 * 60 * 60 * 1000)), timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'Pending', remark: 'Ticket raised for Technical - SFTP', userName: 'Rahul Mehta', documents: [] },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(new Date(now - 3 * 24 * 60 * 60 * 1000)), timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'SFTP port reconfigured', userName: 'Admin', documents: [] },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(new Date(now - 2 * 60 * 60 * 1000)), timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Issue not Resolved. Still failing for files above 10MB.', userName: 'Rahul Mehta', documents: [] }
    ]
  },
  {
    ticketId: 'TKT200002',
    srNo: 202,
    category: 'Functional',
    subCategory: 'SI Related',
    subject: 'SI Satisfaction Entry Not Saving',
    description: 'SI satisfaction form submits but data is not persisted. Re-opened after incomplete fix.',
    status: 'Re-Opened',
    priority: 'Urgent',
    reason: 'Incomplete Resolution',
    raisedOn: formatDate(new Date(now - 8 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formatDate(new Date(now - 5 * 60 * 60 * 1000)),
    initiator: 'Sanjay Reddy',
    raisedBy: 'Sanjay Reddy',
    reClientName: 'Sanjay Reddy',
    fiCode: 'FI123',
    assignedTo: 'IT Support Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(new Date(now - 8 * 24 * 60 * 60 * 1000)), timestamp: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(), status: 'Pending', remark: 'Ticket raised for Functional - SI Related', userName: 'Sanjay Reddy', documents: [] },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(new Date(now - 4 * 24 * 60 * 60 * 1000)), timestamp: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'Database trigger fixed', userName: 'Admin', documents: [] },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(new Date(now - 5 * 60 * 60 * 1000)), timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Incomplete Resolution. Only works for new entries, old entries still missing.', userName: 'Sanjay Reddy', documents: [] }
    ]
  },
  {
    ticketId: 'TKT200003',
    srNo: 203,
    category: 'Operational',
    subCategory: 'Report Related',
    subject: 'Compliance Report Showing Wrong Data',
    description: 'Monthly compliance report has incorrect figures. Resolution applied did not fix all columns.',
    status: 'Re-Opened',
    priority: 'High',
    reason: 'Incorrect Resolution',
    raisedOn: formatDate(new Date(now - 6 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formatDate(new Date(now - 1 * 24 * 60 * 60 * 1000)),
    initiator: 'Meera Krishnan',
    raisedBy: 'Meera Krishnan',
    reClientName: 'Meera Krishnan',
    fiCode: 'FI077',
    assignedTo: 'Operations Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(new Date(now - 6 * 24 * 60 * 60 * 1000)), timestamp: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString(), status: 'Pending', remark: 'Ticket raised for Operational - Report Related', userName: 'Meera Krishnan', documents: [] },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(new Date(now - 3 * 24 * 60 * 60 * 1000)), timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'Report query updated', userName: 'Admin', documents: [] },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(new Date(now - 1 * 24 * 60 * 60 * 1000)), timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Incorrect Resolution. Column D and E still showing wrong totals.', userName: 'Meera Krishnan', documents: [] }
    ]
  },
  {
    ticketId: 'TKT200004',
    srNo: 204,
    category: 'Technical',
    subCategory: 'Login/Access Issue',
    subject: 'Account Locked After Password Change',
    description: 'Account gets locked within 30 minutes of password change. Happened 3 times now.',
    status: 'Re-Opened',
    priority: 'Medium',
    reason: 'Unsatisfactory Response',
    raisedOn: formatDate(new Date(now - 10 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formatDate(new Date(now - 3 * 60 * 60 * 1000)),
    initiator: 'Arun Bhatia',
    raisedBy: 'Arun Bhatia',
    reClientName: 'Arun Bhatia',
    fiCode: 'FI189',
    assignedTo: 'System Admin',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(new Date(now - 10 * 24 * 60 * 60 * 1000)), timestamp: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'Pending', remark: 'Ticket raised for Technical - Login/Access Issue', userName: 'Arun Bhatia', documents: [] },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(new Date(now - 7 * 24 * 60 * 60 * 1000)), timestamp: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'Account unlocked manually', userName: 'Admin', documents: [] },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(new Date(now - 3 * 60 * 60 * 1000)), timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Unsatisfactory Response. Just unlocking is not a fix, root cause not addressed.', userName: 'Arun Bhatia', documents: [] }
    ]
  },
  {
    ticketId: 'TKT200005',
    srNo: 205,
    category: 'CERSAI-CKYC Level Queries',
    subCategory: 'CKYC Related',
    subject: 'CKYC Record Update Failing for NRI Accounts',
    description: 'NRI account CKYC updates throw validation error. Was resolved but issue came back after patch.',
    status: 'Re-Opened',
    priority: 'Urgent',
    reason: 'Issue not Resolved',
    raisedOn: formatDate(new Date(now - 4 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formatDate(new Date(now - 30 * 60 * 1000)),
    initiator: 'Pooja Deshmukh',
    raisedBy: 'Pooja Deshmukh',
    reClientName: 'Pooja Deshmukh',
    fiCode: 'FI210',
    assignedTo: 'Customer Service',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(new Date(now - 4 * 24 * 60 * 60 * 1000)), timestamp: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(), status: 'Pending', remark: 'Ticket raised for CERSAI-CKYC Level Queries - CKYC Related', userName: 'Pooja Deshmukh', documents: [] },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(new Date(now - 2 * 24 * 60 * 60 * 1000)), timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'Validation rule updated for NRI accounts', userName: 'Admin', documents: [] },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(new Date(now - 30 * 60 * 1000)), timestamp: new Date(now - 30 * 60 * 1000).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Issue not Resolved. After latest patch deployment, same error is back.', userName: 'Pooja Deshmukh', documents: [] }
    ]
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected\n');

    const ids = tickets.map(t => t.ticketId);
    const del = await Ticket.deleteMany({ ticketId: { $in: ids } });
    console.log(`Removed ${del.deletedCount} existing tickets\n`);

    const inserted = await Ticket.insertMany(tickets);
    console.log(`Seeded ${inserted.length} Re-Opened tickets:\n`);
    inserted.forEach(t => {
      console.log(`  ${t.ticketId} | ${t.status} | reason: ${t.reason} | ${t.subject}`);
    });

    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
