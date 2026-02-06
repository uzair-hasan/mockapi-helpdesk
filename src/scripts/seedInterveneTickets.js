/**
 * Seed Intervene Tickets for Live Demo
 * Run: node src/scripts/seedInterveneTickets.js
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
const formattedNow = formatDate(now);

const interveneTickets = [
  {
    ticketId: 'TKT100001',
    srNo: 101,
    category: 'Technical',
    subCategory: 'SFTP',
    subject: 'SFTP Connection Timeout Issue',
    description: 'SFTP connection keeps timing out when uploading bulk files. Need immediate resolution.',
    status: 'Pending',
    priority: 'High',
    raisedOn: formatDate(new Date(now - 3 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formattedNow,
    initiator: 'Rajesh Kumar',
    raisedBy: 'Rajesh Kumar',
    reClientName: 'Rajesh Kumar',
    fiCode: 'FI045',
    assignedTo: 'Helpdesk Team',
    auditTrail: [{
      srNo: 1,
      activity: 'Ticket Created',
      date: formatDate(new Date(now - 3 * 24 * 60 * 60 * 1000)),
      timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Pending',
      remark: 'Ticket raised for Technical - SFTP',
      userName: 'Rajesh Kumar'
    }]
  },
  {
    ticketId: 'TKT100002',
    srNo: 102,
    category: 'Operational',
    subCategory: 'Search Related',
    subject: 'Search Not Returning Results for CKYC',
    description: 'CKYC search returning empty results for valid KYC IDs. Multiple users affected.',
    status: 'Clarification Sought',
    priority: 'High',
    raisedOn: formatDate(new Date(now - 5 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formatDate(new Date(now - 1 * 24 * 60 * 60 * 1000)),
    initiator: 'Priya Sharma',
    raisedBy: 'Priya Sharma',
    reClientName: 'Priya Sharma',
    fiCode: 'FI112',
    assignedTo: 'Technical Support',
    auditTrail: [
      {
        srNo: 1,
        activity: 'Ticket Created',
        date: formatDate(new Date(now - 5 * 24 * 60 * 60 * 1000)),
        timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        remark: 'Ticket raised for Operational - Search Related',
        userName: 'Priya Sharma'
      },
      {
        srNo: 2,
        activity: 'Clarification Requested',
        date: formatDate(new Date(now - 1 * 24 * 60 * 60 * 1000)),
        timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Clarification Sought',
        previousStatus: 'Pending',
        remark: 'Please provide the exact KYC IDs that are failing',
        userName: 'Admin'
      }
    ]
  },
  {
    ticketId: 'TKT100003',
    srNo: 103,
    category: 'Functional',
    subCategory: 'SI Related',
    subject: 'SI Creation Failing with Error Code 500',
    description: 'Security Interest creation is failing with server error. Blocking daily operations.',
    status: 'Assigned to RE',
    priority: 'Urgent',
    raisedOn: formatDate(new Date(now - 2 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formatDate(new Date(now - 6 * 60 * 60 * 1000)),
    initiator: 'Amit Patel',
    raisedBy: 'Amit Patel',
    reClientName: 'Amit Patel',
    fiCode: 'FI078',
    assignedTo: 'IT Support Team',
    auditTrail: [
      {
        srNo: 1,
        activity: 'Ticket Created',
        date: formatDate(new Date(now - 2 * 24 * 60 * 60 * 1000)),
        timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        remark: 'Ticket raised for Functional - SI Related',
        userName: 'Amit Patel'
      },
      {
        srNo: 2,
        activity: 'Assigned to RE',
        date: formatDate(new Date(now - 6 * 60 * 60 * 1000)),
        timestamp: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
        status: 'Assigned to RE',
        previousStatus: 'Pending',
        remark: 'Assigned to IT Support Team for investigation',
        userName: 'Admin'
      }
    ]
  },
  {
    ticketId: 'TKT100004',
    srNo: 104,
    category: 'Technical',
    subCategory: 'Login/Access Issue',
    subject: 'Unable to Login After Password Reset',
    description: 'User unable to login even after resetting password. Getting invalid credentials error.',
    status: 'Re-Opened',
    priority: 'Medium',
    raisedOn: formatDate(new Date(now - 7 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formatDate(new Date(now - 12 * 60 * 60 * 1000)),
    initiator: 'Sneha Gupta',
    raisedBy: 'Sneha Gupta',
    reClientName: 'Sneha Gupta',
    fiCode: 'FI201',
    assignedTo: 'System Admin',
    auditTrail: [
      {
        srNo: 1,
        activity: 'Ticket Created',
        date: formatDate(new Date(now - 7 * 24 * 60 * 60 * 1000)),
        timestamp: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        remark: 'Ticket raised for Technical - Login/Access Issue',
        userName: 'Sneha Gupta'
      },
      {
        srNo: 2,
        activity: 'Ticket Resolved',
        date: formatDate(new Date(now - 3 * 24 * 60 * 60 * 1000)),
        timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Resolved',
        previousStatus: 'Pending',
        remark: 'Password reset completed and access restored',
        userName: 'Admin'
      },
      {
        srNo: 3,
        activity: 'Ticket Re-Opened',
        date: formatDate(new Date(now - 12 * 60 * 60 * 1000)),
        timestamp: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
        status: 'Re-Opened',
        previousStatus: 'Resolved',
        remark: 'Issue reoccurred after password reset. Still unable to login.',
        userName: 'Sneha Gupta'
      }
    ]
  },
  {
    ticketId: 'TKT100005',
    srNo: 105,
    category: 'Miscellaneous',
    subCategory: 'Others',
    subject: 'Request for API Documentation Update',
    description: 'API documentation is outdated. Need updated docs for latest endpoints.',
    status: 'Resolved',
    priority: 'Low',
    raisedOn: formatDate(new Date(now - 10 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formatDate(new Date(now - 2 * 24 * 60 * 60 * 1000)),
    initiator: 'Vikram Singh',
    raisedBy: 'Vikram Singh',
    reClientName: 'Vikram Singh',
    fiCode: 'FI033',
    assignedTo: 'Operations Team',
    auditTrail: [
      {
        srNo: 1,
        activity: 'Ticket Created',
        date: formatDate(new Date(now - 10 * 24 * 60 * 60 * 1000)),
        timestamp: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        remark: 'Ticket raised for Miscellaneous - Others',
        userName: 'Vikram Singh'
      },
      {
        srNo: 2,
        activity: 'Ticket Resolved',
        date: formatDate(new Date(now - 2 * 24 * 60 * 60 * 1000)),
        timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Resolved',
        previousStatus: 'Pending',
        remark: 'API documentation updated and shared via portal',
        userName: 'Admin'
      }
    ]
  },
  {
    ticketId: 'TKT100006',
    srNo: 106,
    category: 'CERSAI-CKYC Level Queries',
    subCategory: 'CKYC Related',
    subject: 'CKYC Data Mismatch in Bulk Upload',
    description: 'Bulk upload showing data mismatch for 500+ records. Need urgent intervention.',
    status: 'Clarification Provided',
    priority: 'Urgent',
    raisedOn: formatDate(new Date(now - 4 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formatDate(new Date(now - 8 * 60 * 60 * 1000)),
    initiator: 'Neha Agarwal',
    raisedBy: 'Neha Agarwal',
    reClientName: 'Neha Agarwal',
    fiCode: 'FI156',
    assignedTo: 'Customer Service',
    auditTrail: [
      {
        srNo: 1,
        activity: 'Ticket Created',
        date: formatDate(new Date(now - 4 * 24 * 60 * 60 * 1000)),
        timestamp: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        remark: 'Ticket raised for CERSAI-CKYC Level Queries - CKYC Related',
        userName: 'Neha Agarwal'
      },
      {
        srNo: 2,
        activity: 'Clarification Requested',
        date: formatDate(new Date(now - 2 * 24 * 60 * 60 * 1000)),
        timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Clarification Sought',
        previousStatus: 'Pending',
        remark: 'Please provide the batch ID and sample records with mismatch',
        userName: 'Admin'
      },
      {
        srNo: 3,
        activity: 'Clarification Provided',
        date: formatDate(new Date(now - 8 * 60 * 60 * 1000)),
        timestamp: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
        status: 'Clarification Provided',
        previousStatus: 'Clarification Sought',
        remark: 'Batch ID: BT20260201. Attached sample CSV with mismatched records.',
        userName: 'Neha Agarwal'
      }
    ]
  },
  {
    ticketId: 'TKT100007',
    srNo: 107,
    category: 'Technical',
    subCategory: 'SFTP',
    subject: 'SFTP Key Exchange Failure',
    description: 'SSH key exchange failing during SFTP connection. Server rejecting the public key.',
    status: 'Responded by RE',
    priority: 'High',
    raisedOn: formatDate(new Date(now - 6 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formatDate(new Date(now - 4 * 60 * 60 * 1000)),
    initiator: 'Suresh Menon',
    raisedBy: 'Suresh Menon',
    reClientName: 'Suresh Menon',
    fiCode: 'FI089',
    assignedTo: 'Network Team',
    auditTrail: [
      {
        srNo: 1,
        activity: 'Ticket Created',
        date: formatDate(new Date(now - 6 * 24 * 60 * 60 * 1000)),
        timestamp: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        remark: 'Ticket raised for Technical - SFTP',
        userName: 'Suresh Menon'
      },
      {
        srNo: 2,
        activity: 'Assigned to RE',
        date: formatDate(new Date(now - 4 * 24 * 60 * 60 * 1000)),
        timestamp: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Assigned to RE',
        previousStatus: 'Pending',
        remark: 'Assigned to Network Team',
        userName: 'Admin'
      },
      {
        srNo: 3,
        activity: 'RE Responded',
        date: formatDate(new Date(now - 4 * 60 * 60 * 1000)),
        timestamp: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
        status: 'Responded by RE',
        previousStatus: 'Assigned to RE',
        remark: 'SSH key has been regenerated. Please try reconnecting with the new key.',
        userName: 'Network Team'
      }
    ]
  },
  {
    ticketId: 'TKT100008',
    srNo: 108,
    category: 'Operational',
    subCategory: 'Report Related',
    subject: 'Monthly Report Generation Failing',
    description: 'January 2026 monthly compliance report is not generating. Deadline approaching.',
    status: 'Pending',
    priority: 'Urgent',
    raisedOn: formatDate(new Date(now - 1 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formatDate(new Date(now - 1 * 24 * 60 * 60 * 1000)),
    initiator: 'Deepak Joshi',
    raisedBy: 'Deepak Joshi',
    reClientName: 'Deepak Joshi',
    fiCode: 'FI067',
    assignedTo: 'Technical Support',
    auditTrail: [{
      srNo: 1,
      activity: 'Ticket Created',
      date: formatDate(new Date(now - 1 * 24 * 60 * 60 * 1000)),
      timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Pending',
      remark: 'Ticket raised for Operational - Report Related',
      userName: 'Deepak Joshi'
    }]
  },
  {
    ticketId: 'TKT100009',
    srNo: 109,
    category: 'Functional',
    subCategory: 'SI Related',
    subject: 'SI Modification Not Reflecting in Dashboard',
    description: 'Modified Security Interest records not updating in the dashboard view. Data inconsistency.',
    status: 'Pending',
    priority: 'Medium',
    raisedOn: formatDate(new Date(now - 2 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formatDate(new Date(now - 2 * 24 * 60 * 60 * 1000)),
    initiator: 'Kavitha Nair',
    raisedBy: 'Kavitha Nair',
    reClientName: 'Kavitha Nair',
    fiCode: 'FI134',
    assignedTo: 'Helpdesk Team',
    auditTrail: [{
      srNo: 1,
      activity: 'Ticket Created',
      date: formatDate(new Date(now - 2 * 24 * 60 * 60 * 1000)),
      timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Pending',
      remark: 'Ticket raised for Functional - SI Related',
      userName: 'Kavitha Nair'
    }]
  },
  {
    ticketId: 'TKT100010',
    srNo: 110,
    category: 'Technical',
    subCategory: 'Login/Access Issue',
    subject: 'Two-Factor Authentication Not Sending OTP',
    description: '2FA OTP not being received on registered mobile number. Multiple users reporting same issue.',
    status: 'Clarification Sought',
    priority: 'High',
    raisedOn: formatDate(new Date(now - 3 * 24 * 60 * 60 * 1000)),
    lastUpdatedOn: formatDate(new Date(now - 5 * 60 * 60 * 1000)),
    initiator: 'Ankit Verma',
    raisedBy: 'Ankit Verma',
    reClientName: 'Ankit Verma',
    fiCode: 'FI098',
    assignedTo: 'System Admin',
    auditTrail: [
      {
        srNo: 1,
        activity: 'Ticket Created',
        date: formatDate(new Date(now - 3 * 24 * 60 * 60 * 1000)),
        timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
        remark: 'Ticket raised for Technical - Login/Access Issue',
        userName: 'Ankit Verma'
      },
      {
        srNo: 2,
        activity: 'Clarification Requested',
        date: formatDate(new Date(now - 5 * 60 * 60 * 1000)),
        timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
        status: 'Clarification Sought',
        previousStatus: 'Pending',
        remark: 'Please confirm the registered mobile number and telecom provider',
        userName: 'Admin'
      }
    ]
  }
];

async function seedInterveneTickets() {
  try {
    console.log('Connecting to MongoDB...');
    console.log(`URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Remove existing seeded tickets to avoid duplicates
    const ticketIds = interveneTickets.map(t => t.ticketId);
    const deleted = await Ticket.deleteMany({ ticketId: { $in: ticketIds } });
    console.log(`Removed ${deleted.deletedCount} existing seeded tickets\n`);

    // Insert new tickets
    const inserted = await Ticket.insertMany(interveneTickets);
    console.log(`Seeded ${inserted.length} intervene tickets:\n`);

    inserted.forEach(t => {
      console.log(`  ${t.ticketId} | ${t.status.padEnd(24)} | ${t.subject}`);
    });

    console.log('\nStatus summary:');
    const statusCount = {};
    inserted.forEach(t => {
      statusCount[t.status] = (statusCount[t.status] || 0) + 1;
    });
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });

    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedInterveneTickets();
