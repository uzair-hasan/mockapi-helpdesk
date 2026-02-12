/**
 * Seed Intervene Tickets for Live Demo (20+ tickets for pagination testing)
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

// Helper: create a date N days/hours ago
function daysAgo(d) { return new Date(now - d * 24 * 60 * 60 * 1000); }
function hoursAgo(h) { return new Date(now - h * 60 * 60 * 1000); }

const interveneTickets = [
  // ===== Re-Opened tickets (12) =====
  {
    ticketId: 'TKT100001',
    srNo: 101,
    category: 'Technical',
    subCategory: 'SFTP',
    subject: 'SFTP Connection Timeout Issue',
    description: 'SFTP connection keeps timing out when uploading bulk files. Need immediate resolution.',
    status: 'Re-Opened',
    priority: 'High',
    raisedOn: formatDate(daysAgo(10)),
    lastUpdatedOn: formatDate(daysAgo(1)),
    initiator: 'Rajesh Kumar',
    raisedBy: 'Rajesh Kumar',
    reClientName: 'Rajesh Kumar',
    fiCode: 'FI045',
    assignedTo: 'Helpdesk Team',
    reason: 'Issue reoccurred after initial fix',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(10)), timestamp: daysAgo(10).toISOString(), status: 'Pending', remark: 'Ticket raised for Technical - SFTP', userName: 'Rajesh Kumar' },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(daysAgo(5)), timestamp: daysAgo(5).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'SFTP config updated, timeout increased', userName: 'Admin' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(daysAgo(1)), timestamp: daysAgo(1).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Issue reoccurred after initial fix', userName: 'Rajesh Kumar' }
    ]
  },
  {
    ticketId: 'TKT100002',
    srNo: 102,
    category: 'Operational',
    subCategory: 'Search Related',
    subject: 'Search Not Returning Results for CKYC',
    description: 'CKYC search returning empty results for valid KYC IDs. Multiple users affected.',
    status: 'Re-Opened',
    priority: 'High',
    raisedOn: formatDate(daysAgo(12)),
    lastUpdatedOn: formatDate(daysAgo(2)),
    initiator: 'Priya Sharma',
    raisedBy: 'Priya Sharma',
    reClientName: 'Priya Sharma',
    fiCode: 'FI112',
    assignedTo: 'Technical Support',
    reason: 'Search still failing for certain KYC ID formats',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(12)), timestamp: daysAgo(12).toISOString(), status: 'Pending', remark: 'Ticket raised for Operational - Search Related', userName: 'Priya Sharma' },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(daysAgo(7)), timestamp: daysAgo(7).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'Search index rebuilt successfully', userName: 'Admin' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(daysAgo(2)), timestamp: daysAgo(2).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Search still failing for certain KYC ID formats', userName: 'Priya Sharma' }
    ]
  },
  {
    ticketId: 'TKT100003',
    srNo: 103,
    category: 'Technical',
    subCategory: 'Login/Access Issue',
    subject: 'Unable to Login After Password Reset',
    description: 'User unable to login even after resetting password. Getting invalid credentials error.',
    status: 'Re-Opened',
    priority: 'Medium',
    raisedOn: formatDate(daysAgo(14)),
    lastUpdatedOn: formatDate(hoursAgo(12)),
    initiator: 'Sneha Gupta',
    raisedBy: 'Sneha Gupta',
    reClientName: 'Sneha Gupta',
    fiCode: 'FI201',
    assignedTo: 'System Admin',
    reason: 'Issue reoccurred after password reset',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(14)), timestamp: daysAgo(14).toISOString(), status: 'Pending', remark: 'Ticket raised for Technical - Login/Access Issue', userName: 'Sneha Gupta' },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(daysAgo(8)), timestamp: daysAgo(8).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'Password reset completed and access restored', userName: 'Admin' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(hoursAgo(12)), timestamp: hoursAgo(12).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Issue reoccurred after password reset', userName: 'Sneha Gupta' }
    ]
  },
  {
    ticketId: 'TKT100004',
    srNo: 104,
    category: 'Functional',
    subCategory: 'SI Related',
    subject: 'SI Creation Failing with Error Code 500',
    description: 'Security Interest creation is failing with server error. Blocking daily operations.',
    status: 'Re-Opened',
    priority: 'Urgent',
    raisedOn: formatDate(daysAgo(8)),
    lastUpdatedOn: formatDate(hoursAgo(6)),
    initiator: 'Amit Patel',
    raisedBy: 'Amit Patel',
    reClientName: 'Amit Patel',
    fiCode: 'FI078',
    assignedTo: 'IT Support Team',
    reason: 'Error still occurs for bulk SI creation',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(8)), timestamp: daysAgo(8).toISOString(), status: 'Pending', remark: 'Ticket raised for Functional - SI Related', userName: 'Amit Patel' },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(daysAgo(4)), timestamp: daysAgo(4).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'Server configuration updated, SI creation fixed', userName: 'Admin' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(hoursAgo(6)), timestamp: hoursAgo(6).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Error still occurs for bulk SI creation', userName: 'Amit Patel' }
    ]
  },
  {
    ticketId: 'TKT100005',
    srNo: 105,
    category: 'Technical',
    subCategory: 'Login/Access Issue',
    subject: 'Two-Factor Authentication Not Sending OTP',
    description: '2FA OTP not being received on registered mobile number. Multiple users reporting.',
    status: 'Re-Opened',
    priority: 'High',
    raisedOn: formatDate(daysAgo(9)),
    lastUpdatedOn: formatDate(hoursAgo(18)),
    initiator: 'Ankit Verma',
    raisedBy: 'Ankit Verma',
    reClientName: 'Ankit Verma',
    fiCode: 'FI098',
    assignedTo: 'System Admin',
    reason: 'OTP delivery still inconsistent on Airtel network',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(9)), timestamp: daysAgo(9).toISOString(), status: 'Pending', remark: 'Ticket raised for Technical - Login/Access Issue', userName: 'Ankit Verma' },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(daysAgo(5)), timestamp: daysAgo(5).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'SMS gateway reconfigured', userName: 'Admin' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(hoursAgo(18)), timestamp: hoursAgo(18).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: OTP delivery still inconsistent on Airtel network', userName: 'Ankit Verma' }
    ]
  },
  {
    ticketId: 'TKT100006',
    srNo: 106,
    category: 'CERSAI-CKYC Level Queries',
    subCategory: 'CKYC Related',
    subject: 'CKYC Data Mismatch in Bulk Upload',
    description: 'Bulk upload showing data mismatch for 500+ records. Need urgent intervention.',
    status: 'Re-Opened',
    priority: 'Urgent',
    raisedOn: formatDate(daysAgo(11)),
    lastUpdatedOn: formatDate(hoursAgo(3)),
    initiator: 'Neha Agarwal',
    raisedBy: 'Neha Agarwal',
    reClientName: 'Neha Agarwal',
    fiCode: 'FI156',
    assignedTo: 'Customer Service',
    reason: 'Mismatch still present in 200+ records after fix',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(11)), timestamp: daysAgo(11).toISOString(), status: 'Pending', remark: 'Ticket raised for CERSAI-CKYC Level Queries - CKYC Related', userName: 'Neha Agarwal' },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(daysAgo(6)), timestamp: daysAgo(6).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'Bulk upload validation logic fixed', userName: 'Admin' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(hoursAgo(3)), timestamp: hoursAgo(3).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Mismatch still present in 200+ records after fix', userName: 'Neha Agarwal' }
    ]
  },
  {
    ticketId: 'TKT100007',
    srNo: 107,
    category: 'Technical',
    subCategory: 'SFTP',
    subject: 'SFTP Key Exchange Failure',
    description: 'SSH key exchange failing during SFTP connection. Server rejecting the public key.',
    status: 'Re-Opened',
    priority: 'High',
    raisedOn: formatDate(daysAgo(13)),
    lastUpdatedOn: formatDate(hoursAgo(8)),
    initiator: 'Suresh Menon',
    raisedBy: 'Suresh Menon',
    reClientName: 'Suresh Menon',
    fiCode: 'FI089',
    assignedTo: 'Network Team',
    reason: 'Key exchange fails intermittently during peak hours',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(13)), timestamp: daysAgo(13).toISOString(), status: 'Pending', remark: 'Ticket raised for Technical - SFTP', userName: 'Suresh Menon' },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(daysAgo(7)), timestamp: daysAgo(7).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'SSH key regenerated and access restored', userName: 'Admin' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(hoursAgo(8)), timestamp: hoursAgo(8).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Key exchange fails intermittently during peak hours', userName: 'Suresh Menon' }
    ]
  },
  {
    ticketId: 'TKT100008',
    srNo: 108,
    category: 'Operational',
    subCategory: 'Report Related',
    subject: 'Monthly Report Generation Failing',
    description: 'January 2026 monthly compliance report is not generating. Deadline approaching.',
    status: 'Re-Opened',
    priority: 'Urgent',
    raisedOn: formatDate(daysAgo(15)),
    lastUpdatedOn: formatDate(daysAgo(1)),
    initiator: 'Deepak Joshi',
    raisedBy: 'Deepak Joshi',
    reClientName: 'Deepak Joshi',
    fiCode: 'FI067',
    assignedTo: 'Technical Support',
    reason: 'Report generates but with missing data columns',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(15)), timestamp: daysAgo(15).toISOString(), status: 'Pending', remark: 'Ticket raised for Operational - Report Related', userName: 'Deepak Joshi' },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(daysAgo(10)), timestamp: daysAgo(10).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'Report generation module patched', userName: 'Admin' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(daysAgo(1)), timestamp: daysAgo(1).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Report generates but with missing data columns', userName: 'Deepak Joshi' }
    ]
  },
  {
    ticketId: 'TKT100009',
    srNo: 109,
    category: 'Functional',
    subCategory: 'SI Related',
    subject: 'SI Modification Not Reflecting in Dashboard',
    description: 'Modified Security Interest records not updating in the dashboard view.',
    status: 'Re-Opened',
    priority: 'Medium',
    raisedOn: formatDate(daysAgo(7)),
    lastUpdatedOn: formatDate(hoursAgo(20)),
    initiator: 'Kavitha Nair',
    raisedBy: 'Kavitha Nair',
    reClientName: 'Kavitha Nair',
    fiCode: 'FI134',
    assignedTo: 'Helpdesk Team',
    reason: 'Dashboard cache not clearing after modification',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(7)), timestamp: daysAgo(7).toISOString(), status: 'Pending', remark: 'Ticket raised for Functional - SI Related', userName: 'Kavitha Nair' },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(daysAgo(3)), timestamp: daysAgo(3).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'Cache invalidation logic updated', userName: 'Admin' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(hoursAgo(20)), timestamp: hoursAgo(20).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Dashboard cache not clearing after modification', userName: 'Kavitha Nair' }
    ]
  },
  {
    ticketId: 'TKT100010',
    srNo: 110,
    category: 'Miscellaneous',
    subCategory: 'Others',
    subject: 'Email Notifications Not Being Delivered',
    description: 'Ticket status update email notifications stopped working since last week.',
    status: 'Re-Opened',
    priority: 'Medium',
    raisedOn: formatDate(daysAgo(10)),
    lastUpdatedOn: formatDate(hoursAgo(5)),
    initiator: 'Vikram Singh',
    raisedBy: 'Vikram Singh',
    reClientName: 'Vikram Singh',
    fiCode: 'FI033',
    assignedTo: 'Operations Team',
    reason: 'Emails working for some users but not others',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(10)), timestamp: daysAgo(10).toISOString(), status: 'Pending', remark: 'Ticket raised for Miscellaneous - Others', userName: 'Vikram Singh' },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(daysAgo(6)), timestamp: daysAgo(6).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'SMTP server reconfigured', userName: 'Admin' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(hoursAgo(5)), timestamp: hoursAgo(5).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Emails working for some users but not others', userName: 'Vikram Singh' }
    ]
  },
  {
    ticketId: 'TKT100011',
    srNo: 111,
    category: 'Technical',
    subCategory: 'Login/Access Issue',
    subject: 'Session Expiring Too Quickly',
    description: 'User sessions are expiring after 2 minutes of inactivity instead of configured 30 minutes.',
    status: 'Re-Opened',
    priority: 'High',
    raisedOn: formatDate(daysAgo(6)),
    lastUpdatedOn: formatDate(hoursAgo(2)),
    initiator: 'Rohit Mehta',
    raisedBy: 'Rohit Mehta',
    reClientName: 'Rohit Mehta',
    fiCode: 'FI210',
    assignedTo: 'System Admin',
    reason: 'Session timeout reverted after server restart',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(6)), timestamp: daysAgo(6).toISOString(), status: 'Pending', remark: 'Ticket raised for Technical - Login/Access Issue', userName: 'Rohit Mehta' },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(daysAgo(3)), timestamp: daysAgo(3).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'Session timeout configuration updated to 30 min', userName: 'Admin' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(hoursAgo(2)), timestamp: hoursAgo(2).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Session timeout reverted after server restart', userName: 'Rohit Mehta' }
    ]
  },
  {
    ticketId: 'TKT100012',
    srNo: 112,
    category: 'CERSAI-CKYC Level Queries',
    subCategory: 'CKYC Related',
    subject: 'CKYC Record Duplication on Update',
    description: 'Updating existing CKYC records creates duplicate entries instead of updating in place.',
    status: 'Re-Opened',
    priority: 'Urgent',
    raisedOn: formatDate(daysAgo(5)),
    lastUpdatedOn: formatDate(hoursAgo(10)),
    initiator: 'Meera Reddy',
    raisedBy: 'Meera Reddy',
    reClientName: 'Meera Reddy',
    fiCode: 'FI177',
    assignedTo: 'Technical Support',
    reason: 'Duplication still occurs for records with special characters in name',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(5)), timestamp: daysAgo(5).toISOString(), status: 'Pending', remark: 'Ticket raised for CERSAI-CKYC Level Queries - CKYC Related', userName: 'Meera Reddy' },
      { srNo: 2, activity: 'Ticket Resolved', date: formatDate(daysAgo(2)), timestamp: daysAgo(2).toISOString(), status: 'Resolved', previousStatus: 'Pending', remark: 'Upsert logic fixed for CKYC updates', userName: 'Admin' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: formatDate(hoursAgo(10)), timestamp: hoursAgo(10).toISOString(), status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Reason: Duplication still occurs for records with special characters in name', userName: 'Meera Reddy' }
    ]
  },

  // ===== Clarification Provided tickets (13) =====
  {
    ticketId: 'TKT100013',
    srNo: 113,
    category: 'Operational',
    subCategory: 'Search Related',
    subject: 'Advanced Search Filters Not Working',
    description: 'Date range and status filters in advanced search return incorrect results.',
    status: 'Clarification Provided',
    priority: 'Medium',
    raisedOn: formatDate(daysAgo(4)),
    lastUpdatedOn: formatDate(hoursAgo(4)),
    initiator: 'Sanjay Rao',
    raisedBy: 'Sanjay Rao',
    reClientName: 'Sanjay Rao',
    fiCode: 'FI055',
    assignedTo: 'Helpdesk Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(4)), timestamp: daysAgo(4).toISOString(), status: 'Pending', remark: 'Ticket raised for Operational - Search Related', userName: 'Sanjay Rao' },
      { srNo: 2, activity: 'Clarification Requested', date: formatDate(daysAgo(2)), timestamp: daysAgo(2).toISOString(), status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Which specific filters are failing? Please share screenshots.', userName: 'Admin' },
      { srNo: 3, activity: 'Clarification Provided', date: formatDate(hoursAgo(4)), timestamp: hoursAgo(4).toISOString(), status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'Date range filter fails when selecting cross-month ranges. Screenshot attached.', userName: 'Sanjay Rao' }
    ]
  },
  {
    ticketId: 'TKT100014',
    srNo: 114,
    category: 'Technical',
    subCategory: 'SFTP',
    subject: 'SFTP Upload Corrupting Large Files',
    description: 'Files larger than 100MB getting corrupted during SFTP upload. MD5 checksum mismatch.',
    status: 'Clarification Provided',
    priority: 'High',
    raisedOn: formatDate(daysAgo(6)),
    lastUpdatedOn: formatDate(hoursAgo(7)),
    initiator: 'Pooja Desai',
    raisedBy: 'Pooja Desai',
    reClientName: 'Pooja Desai',
    fiCode: 'FI122',
    assignedTo: 'Network Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(6)), timestamp: daysAgo(6).toISOString(), status: 'Pending', remark: 'Ticket raised for Technical - SFTP', userName: 'Pooja Desai' },
      { srNo: 2, activity: 'Clarification Requested', date: formatDate(daysAgo(3)), timestamp: daysAgo(3).toISOString(), status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Please provide file sizes and SFTP client version being used.', userName: 'Admin' },
      { srNo: 3, activity: 'Clarification Provided', date: formatDate(hoursAgo(7)), timestamp: hoursAgo(7).toISOString(), status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'File size: 150MB. Using WinSCP 6.1. Happens only with CSV files.', userName: 'Pooja Desai' }
    ]
  },
  {
    ticketId: 'TKT100015',
    srNo: 115,
    category: 'Functional',
    subCategory: 'SI Related',
    subject: 'SI Satisfaction Entry Missing Fields',
    description: 'SI satisfaction form not showing all required fields for certain asset types.',
    status: 'Clarification Provided',
    priority: 'Medium',
    raisedOn: formatDate(daysAgo(5)),
    lastUpdatedOn: formatDate(hoursAgo(9)),
    initiator: 'Manoj Tiwari',
    raisedBy: 'Manoj Tiwari',
    reClientName: 'Manoj Tiwari',
    fiCode: 'FI188',
    assignedTo: 'IT Support Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(5)), timestamp: daysAgo(5).toISOString(), status: 'Pending', remark: 'Ticket raised for Functional - SI Related', userName: 'Manoj Tiwari' },
      { srNo: 2, activity: 'Clarification Requested', date: formatDate(daysAgo(3)), timestamp: daysAgo(3).toISOString(), status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Which asset types are affected? Please list the missing fields.', userName: 'Admin' },
      { srNo: 3, activity: 'Clarification Provided', date: formatDate(hoursAgo(9)), timestamp: hoursAgo(9).toISOString(), status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'Affected asset types: Movable Property, Plant & Machinery. Missing: Registration Number, Valuation Date.', userName: 'Manoj Tiwari' }
    ]
  },
  {
    ticketId: 'TKT100016',
    srNo: 116,
    category: 'Technical',
    subCategory: 'Login/Access Issue',
    subject: 'Role-Based Access Showing Wrong Menus',
    description: 'Admin users seeing RE menus and RE users seeing admin options. Access control mismatch.',
    status: 'Clarification Provided',
    priority: 'High',
    raisedOn: formatDate(daysAgo(3)),
    lastUpdatedOn: formatDate(hoursAgo(1)),
    initiator: 'Arun Prakash',
    raisedBy: 'Arun Prakash',
    reClientName: 'Arun Prakash',
    fiCode: 'FI065',
    assignedTo: 'System Admin',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(3)), timestamp: daysAgo(3).toISOString(), status: 'Pending', remark: 'Ticket raised for Technical - Login/Access Issue', userName: 'Arun Prakash' },
      { srNo: 2, activity: 'Clarification Requested', date: formatDate(daysAgo(1)), timestamp: daysAgo(1).toISOString(), status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Please provide affected user IDs and their expected roles.', userName: 'Admin' },
      { srNo: 3, activity: 'Clarification Provided', date: formatDate(hoursAgo(1)), timestamp: hoursAgo(1).toISOString(), status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'User IDs: USR001 (Admin seeing RE menu), USR045 (RE seeing Admin panel). Started after Feb 5 deployment.', userName: 'Arun Prakash' }
    ]
  },
  {
    ticketId: 'TKT100017',
    srNo: 117,
    category: 'CERSAI-CKYC Level Queries',
    subCategory: 'CKYC Related',
    subject: 'CKYC Download Returning Blank PDF',
    description: 'CKYC record PDF download generates blank pages for certain record types.',
    status: 'Clarification Provided',
    priority: 'Medium',
    raisedOn: formatDate(daysAgo(7)),
    lastUpdatedOn: formatDate(hoursAgo(14)),
    initiator: 'Divya Bhatt',
    raisedBy: 'Divya Bhatt',
    reClientName: 'Divya Bhatt',
    fiCode: 'FI143',
    assignedTo: 'Technical Support',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(7)), timestamp: daysAgo(7).toISOString(), status: 'Pending', remark: 'Ticket raised for CERSAI-CKYC Level Queries - CKYC Related', userName: 'Divya Bhatt' },
      { srNo: 2, activity: 'Clarification Requested', date: formatDate(daysAgo(4)), timestamp: daysAgo(4).toISOString(), status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Which CKYC record IDs produce blank PDFs? Browser used?', userName: 'Admin' },
      { srNo: 3, activity: 'Clarification Provided', date: formatDate(hoursAgo(14)), timestamp: hoursAgo(14).toISOString(), status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'CKYC IDs: 50012345678, 50012345690. Using Chrome 121. PDF is 1 page but blank.', userName: 'Divya Bhatt' }
    ]
  },
  {
    ticketId: 'TKT100018',
    srNo: 118,
    category: 'Operational',
    subCategory: 'Report Related',
    subject: 'Quarterly Compliance Report Data Discrepancy',
    description: 'Q4 2025 compliance report showing different totals compared to the dashboard.',
    status: 'Clarification Provided',
    priority: 'High',
    raisedOn: formatDate(daysAgo(8)),
    lastUpdatedOn: formatDate(hoursAgo(16)),
    initiator: 'Ravi Shankar',
    raisedBy: 'Ravi Shankar',
    reClientName: 'Ravi Shankar',
    fiCode: 'FI091',
    assignedTo: 'Operations Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(8)), timestamp: daysAgo(8).toISOString(), status: 'Pending', remark: 'Ticket raised for Operational - Report Related', userName: 'Ravi Shankar' },
      { srNo: 2, activity: 'Clarification Requested', date: formatDate(daysAgo(5)), timestamp: daysAgo(5).toISOString(), status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Please share specific metrics that differ and the expected values.', userName: 'Admin' },
      { srNo: 3, activity: 'Clarification Provided', date: formatDate(hoursAgo(16)), timestamp: hoursAgo(16).toISOString(), status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'Dashboard shows 15,234 total SIs but report says 14,890. Difference of 344 records.', userName: 'Ravi Shankar' }
    ]
  },
  {
    ticketId: 'TKT100019',
    srNo: 119,
    category: 'Miscellaneous',
    subCategory: 'Others',
    subject: 'Bulk Import Template Format Issue',
    description: 'New bulk import Excel template missing mandatory columns for CKYC data.',
    status: 'Clarification Provided',
    priority: 'Low',
    raisedOn: formatDate(daysAgo(4)),
    lastUpdatedOn: formatDate(hoursAgo(11)),
    initiator: 'Lakshmi Iyer',
    raisedBy: 'Lakshmi Iyer',
    reClientName: 'Lakshmi Iyer',
    fiCode: 'FI077',
    assignedTo: 'Customer Service',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(4)), timestamp: daysAgo(4).toISOString(), status: 'Pending', remark: 'Ticket raised for Miscellaneous - Others', userName: 'Lakshmi Iyer' },
      { srNo: 2, activity: 'Clarification Requested', date: formatDate(daysAgo(2)), timestamp: daysAgo(2).toISOString(), status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Which specific columns are missing? Please attach the template you downloaded.', userName: 'Admin' },
      { srNo: 3, activity: 'Clarification Provided', date: formatDate(hoursAgo(11)), timestamp: hoursAgo(11).toISOString(), status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'Missing columns: PAN Number, Date of Birth, Father Name. Template downloaded on Feb 8.', userName: 'Lakshmi Iyer' }
    ]
  },
  {
    ticketId: 'TKT100020',
    srNo: 120,
    category: 'Technical',
    subCategory: 'SFTP',
    subject: 'SFTP Directory Listing Slow for Large Folders',
    description: 'SFTP directory listing takes over 5 minutes for folders with 10,000+ files.',
    status: 'Clarification Provided',
    priority: 'Medium',
    raisedOn: formatDate(daysAgo(9)),
    lastUpdatedOn: formatDate(hoursAgo(22)),
    initiator: 'Gaurav Kapoor',
    raisedBy: 'Gaurav Kapoor',
    reClientName: 'Gaurav Kapoor',
    fiCode: 'FI166',
    assignedTo: 'Network Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(9)), timestamp: daysAgo(9).toISOString(), status: 'Pending', remark: 'Ticket raised for Technical - SFTP', userName: 'Gaurav Kapoor' },
      { srNo: 2, activity: 'Clarification Requested', date: formatDate(daysAgo(6)), timestamp: daysAgo(6).toISOString(), status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Which SFTP server and directory path? How many files approximately?', userName: 'Admin' },
      { srNo: 3, activity: 'Clarification Provided', date: formatDate(hoursAgo(22)), timestamp: hoursAgo(22).toISOString(), status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'Server: sftp.cersai.org.in, Path: /uploads/daily/. Contains ~12,000 files. Was fine until last month.', userName: 'Gaurav Kapoor' }
    ]
  },
  {
    ticketId: 'TKT100021',
    srNo: 121,
    category: 'Functional',
    subCategory: 'SI Related',
    subject: 'SI Search by Borrower Name Returns Wrong Results',
    description: 'Searching SI records by borrower name returns unrelated records with partial name match.',
    status: 'Clarification Provided',
    priority: 'Medium',
    raisedOn: formatDate(daysAgo(3)),
    lastUpdatedOn: formatDate(hoursAgo(6)),
    initiator: 'Nandini Das',
    raisedBy: 'Nandini Das',
    reClientName: 'Nandini Das',
    fiCode: 'FI199',
    assignedTo: 'Helpdesk Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(3)), timestamp: daysAgo(3).toISOString(), status: 'Pending', remark: 'Ticket raised for Functional - SI Related', userName: 'Nandini Das' },
      { srNo: 2, activity: 'Clarification Requested', date: formatDate(daysAgo(1)), timestamp: daysAgo(1).toISOString(), status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Please share the exact search query and expected vs actual results.', userName: 'Admin' },
      { srNo: 3, activity: 'Clarification Provided', date: formatDate(hoursAgo(6)), timestamp: hoursAgo(6).toISOString(), status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'Searched: "Ramesh Kumar". Expected 2 results, got 47 results including "Suresh Kumar", "Ramesh Singh" etc.', userName: 'Nandini Das' }
    ]
  },
  {
    ticketId: 'TKT100022',
    srNo: 122,
    category: 'CERSAI-CKYC Level Queries',
    subCategory: 'CKYC Related',
    subject: 'CKYC API Response Time Degradation',
    description: 'CKYC verification API response time increased from 200ms to 5s in the last week.',
    status: 'Clarification Provided',
    priority: 'Urgent',
    raisedOn: formatDate(daysAgo(2)),
    lastUpdatedOn: formatDate(hoursAgo(3)),
    initiator: 'Kiran Bose',
    raisedBy: 'Kiran Bose',
    reClientName: 'Kiran Bose',
    fiCode: 'FI220',
    assignedTo: 'Technical Support',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(2)), timestamp: daysAgo(2).toISOString(), status: 'Pending', remark: 'Ticket raised for CERSAI-CKYC Level Queries - CKYC Related', userName: 'Kiran Bose' },
      { srNo: 2, activity: 'Clarification Requested', date: formatDate(daysAgo(1)), timestamp: daysAgo(1).toISOString(), status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Please provide API endpoint URL and sample request/response timestamps.', userName: 'Admin' },
      { srNo: 3, activity: 'Clarification Provided', date: formatDate(hoursAgo(3)), timestamp: hoursAgo(3).toISOString(), status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'Endpoint: /api/ckyc/verify. Avg response: 4.8s (was 180ms). Logs attached for Feb 10-12.', userName: 'Kiran Bose' }
    ]
  },
  {
    ticketId: 'TKT100023',
    srNo: 123,
    category: 'Operational',
    subCategory: 'Search Related',
    subject: 'Export to Excel Feature Timing Out',
    description: 'Export to Excel button times out when result set exceeds 5000 records.',
    status: 'Clarification Provided',
    priority: 'High',
    raisedOn: formatDate(daysAgo(6)),
    lastUpdatedOn: formatDate(hoursAgo(15)),
    initiator: 'Tanvi Malhotra',
    raisedBy: 'Tanvi Malhotra',
    reClientName: 'Tanvi Malhotra',
    fiCode: 'FI082',
    assignedTo: 'IT Support Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(6)), timestamp: daysAgo(6).toISOString(), status: 'Pending', remark: 'Ticket raised for Operational - Search Related', userName: 'Tanvi Malhotra' },
      { srNo: 2, activity: 'Clarification Requested', date: formatDate(daysAgo(4)), timestamp: daysAgo(4).toISOString(), status: 'Clarification Sought', previousStatus: 'Pending', remark: 'How many records are you trying to export? What search criteria?', userName: 'Admin' },
      { srNo: 3, activity: 'Clarification Provided', date: formatDate(hoursAgo(15)), timestamp: hoursAgo(15).toISOString(), status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'Exporting all SIs for FI Code FI082. Total records: ~8,500. Times out after 60 seconds.', userName: 'Tanvi Malhotra' }
    ]
  },
  {
    ticketId: 'TKT100024',
    srNo: 124,
    category: 'Technical',
    subCategory: 'Login/Access Issue',
    subject: 'IP Whitelisting Not Working for VPN Users',
    description: 'Users connecting via corporate VPN are blocked despite their VPN IP being whitelisted.',
    status: 'Clarification Provided',
    priority: 'High',
    raisedOn: formatDate(daysAgo(4)),
    lastUpdatedOn: formatDate(hoursAgo(8)),
    initiator: 'Harsh Pandey',
    raisedBy: 'Harsh Pandey',
    reClientName: 'Harsh Pandey',
    fiCode: 'FI105',
    assignedTo: 'Network Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(4)), timestamp: daysAgo(4).toISOString(), status: 'Pending', remark: 'Ticket raised for Technical - Login/Access Issue', userName: 'Harsh Pandey' },
      { srNo: 2, activity: 'Clarification Requested', date: formatDate(daysAgo(2)), timestamp: daysAgo(2).toISOString(), status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Please provide the VPN provider name and the whitelisted IP range.', userName: 'Admin' },
      { srNo: 3, activity: 'Clarification Provided', date: formatDate(hoursAgo(8)), timestamp: hoursAgo(8).toISOString(), status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'VPN: Cisco AnyConnect. IP range: 10.20.30.0/24. Error: "Access denied from IP 10.20.30.155".', userName: 'Harsh Pandey' }
    ]
  },
  {
    ticketId: 'TKT100025',
    srNo: 125,
    category: 'Miscellaneous',
    subCategory: 'Others',
    subject: 'User Manual PDF Links Broken',
    description: 'Help section user manual PDF links return 404 error. Documentation inaccessible.',
    status: 'Clarification Provided',
    priority: 'Low',
    raisedOn: formatDate(daysAgo(5)),
    lastUpdatedOn: formatDate(hoursAgo(13)),
    initiator: 'Swati Chauhan',
    raisedBy: 'Swati Chauhan',
    reClientName: 'Swati Chauhan',
    fiCode: 'FI048',
    assignedTo: 'Customer Service',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: formatDate(daysAgo(5)), timestamp: daysAgo(5).toISOString(), status: 'Pending', remark: 'Ticket raised for Miscellaneous - Others', userName: 'Swati Chauhan' },
      { srNo: 2, activity: 'Clarification Requested', date: formatDate(daysAgo(3)), timestamp: daysAgo(3).toISOString(), status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Which specific PDF links are broken? From which page in the application?', userName: 'Admin' },
      { srNo: 3, activity: 'Clarification Provided', date: formatDate(hoursAgo(13)), timestamp: hoursAgo(13).toISOString(), status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'All 3 links in Help > User Guides section: SI Guide, CKYC Guide, Admin Manual. All return 404.', userName: 'Swati Chauhan' }
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
