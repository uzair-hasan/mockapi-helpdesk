/**
 * Ticket Database Seeder
 *
 * Seeds the MongoDB database with mock ticket data.
 * Data matches the frontend mock data from TicketManagement/data/mockTicketData.ts
 *
 * Usage: npm run seed
 */

require('dotenv').config();

const mongoose = require('mongoose');
const Ticket = require('../models/ticket.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk_mock';

/**
 * Mock ticket data - matches frontend TicketManagement/data/mockTicketData.ts
 * All tickets now have initiator and assignedTo fields
 */
const mockTickets = [
  {
    srNo: 1,
    ticketId: '7654567897',
    category: 'Technical',
    status: 'Pending',
    raisedOn: '10/09/2025 10:00AM',
    lastUpdatedOn: '12/09/2025 12:00AM',
    subCategory: 'System Performance',
    subject: 'System running slowly after update',
    description: 'After the latest software update, my system has been experiencing significant slowdowns.',
    supportingDocument: 'system_log.pdf',
    priority: 'High',
    reClientName: 'ABC Financial Services',
    fiCode: 'FI001',
    raisedBy: 'John Doe',
    initiator: 'John Doe',
    assignedTo: 'Tech Support Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '10/09/2025 10:00AM', status: 'Pending', remark: 'Ticket raised for Technical - System Performance', userName: 'John Doe' },
      { srNo: 2, activity: 'Assigned to Support Team', date: '10/09/2025 02:30PM', status: 'Pending', remark: 'Ticket assigned to technical support team', userName: 'Support Manager' }
    ]
  },
  {
    srNo: 2,
    ticketId: '7654567898',
    category: 'Operational',
    status: 'Resolved',
    raisedOn: '08/09/2025 10:00AM',
    lastUpdatedOn: '12/09/2025 12:00AM',
    subCategory: 'Data Upload',
    subject: 'Unable to upload bulk data file',
    description: 'CSV file with 5000+ records fails to upload. File size is within limits.',
    supportingDocument: 'error_screenshot.png',
    priority: 'Medium',
    reClientName: 'XYZ Banking Corp',
    fiCode: 'FI002',
    raisedBy: 'Jane Smith',
    initiator: 'Jane Smith',
    assignedTo: 'Data Operations Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '08/09/2025 10:00AM', status: 'Pending', remark: 'Ticket raised for Operational - Data Upload', userName: 'Jane Smith' },
      { srNo: 2, activity: 'Ticket Resolved', date: '12/09/2025 12:00AM', status: 'Resolved', previousStatus: 'Pending', remark: 'Issue resolved', userName: 'Tech Support' }
    ]
  },
  {
    srNo: 3,
    ticketId: '7654567899',
    category: 'Functional',
    status: 'Clarification Sought',
    raisedOn: '05/09/2025 11:30AM',
    lastUpdatedOn: '12/09/2025 12:00AM',
    subCategory: 'Report Generation',
    subject: 'Report format changed unexpectedly',
    description: 'Monthly summary report format has changed. Some columns are missing.',
    supportingDocument: 'report_comparison.xlsx',
    priority: 'Low',
    reClientName: 'Global Finance Ltd',
    fiCode: 'FI003',
    raisedBy: 'Mike Johnson',
    initiator: 'Mike Johnson',
    assignedTo: 'Reports Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '05/09/2025 11:30AM', status: 'Pending', remark: 'Ticket raised for Functional - Report Generation', userName: 'Mike Johnson' },
      { srNo: 2, activity: 'Clarification Requested', date: '07/09/2025 02:00PM', status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Please specify which columns are missing', userName: 'Reports Team' }
    ]
  },
  {
    srNo: 4,
    ticketId: '7654567881',
    category: 'Miscellaneous',
    status: 'Clarification Sought',
    raisedOn: '15/08/2025 02:30PM',
    lastUpdatedOn: '20/08/2025 11:00AM',
    subCategory: 'User Access',
    subject: 'Request for additional module access',
    description: 'Need access to advanced analytics module for quarterly reporting.',
    supportingDocument: 'access_request_form.pdf',
    priority: 'Medium',
    reClientName: 'Premier Credit Union',
    fiCode: 'FI004',
    raisedBy: 'Sarah Williams',
    initiator: 'Sarah Williams',
    assignedTo: 'Access Management Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '15/08/2025 02:30PM', status: 'Pending', remark: 'Ticket raised for Miscellaneous - User Access', userName: 'Sarah Williams' },
      { srNo: 2, activity: 'Clarification Requested', date: '20/08/2025 11:00AM', status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Please provide manager approval email', userName: 'Access Team' }
    ]
  },
  {
    srNo: 5,
    ticketId: '7654567882',
    category: 'Miscellaneous',
    status: 'Resolved',
    raisedOn: '01/09/2025 09:00AM',
    lastUpdatedOn: '05/09/2025 04:00PM',
    subCategory: 'Training',
    subject: 'Request for system training session',
    description: 'Team has new members who need training on core modules.',
    supportingDocument: 'training_request.json',
    priority: 'Low',
    reClientName: 'Metro Banking Solutions',
    fiCode: 'FI005',
    raisedBy: 'Team Lead',
    initiator: 'Robert Chen',
    assignedTo: 'Training Department',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '01/09/2025 09:00AM', status: 'Pending', remark: 'Ticket raised for Miscellaneous - Training', userName: 'Team Lead' },
      { srNo: 2, activity: 'Training Completed', date: '05/09/2025 04:00PM', status: 'Resolved', previousStatus: 'Pending', remark: 'Training session completed successfully', userName: 'Training Team' }
    ]
  },
  {
    srNo: 6,
    ticketId: '7654567879',
    category: 'CERSAI-CKYC Level Queries',
    status: 'Closed',
    raisedOn: '20/08/2025 03:00PM',
    lastUpdatedOn: '28/08/2025 10:00AM',
    subCategory: 'Data Correction',
    subject: 'CKYC record update required',
    description: 'Need to update CKYC record for customer ID CK12345. Address is outdated.',
    supportingDocument: 'ckyc_update_request.pdf',
    priority: 'High',
    reClientName: 'National Trust Bank',
    fiCode: 'FI006',
    raisedBy: 'Compliance Officer',
    initiator: 'Amanda Foster',
    assignedTo: 'CKYC Operations',
    feedback: { rating: 5, comment: 'Excellent service, quick turnaround.', submittedAt: new Date('2025-08-28T10:00:00') },
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '20/08/2025 03:00PM', status: 'Pending', remark: 'Ticket raised for CERSAI-CKYC Level Queries', userName: 'Compliance Officer' },
      { srNo: 2, activity: 'Feedback Submitted', date: '28/08/2025 10:00AM', status: 'Closed', previousStatus: 'Resolved', remark: 'Rating: 5/5', userName: 'Compliance Officer' }
    ]
  },
  {
    srNo: 7,
    ticketId: '7654567883',
    category: 'Technical',
    status: 'Resolved',
    raisedOn: '25/08/2025 08:30AM',
    lastUpdatedOn: '27/08/2025 05:00PM',
    subCategory: 'Login Issues',
    subject: 'Cannot login with SSO credentials',
    description: 'Getting "Authentication Failed" error with SSO. Regular password works.',
    supportingDocument: 'sso_error.png',
    priority: 'Urgent',
    reClientName: 'Capital Investments Inc',
    fiCode: 'FI007',
    raisedBy: 'David Brown',
    initiator: 'David Brown',
    assignedTo: 'IT Security Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '25/08/2025 08:30AM', status: 'Pending', remark: 'Ticket raised for Technical - Login Issues', userName: 'David Brown' },
      { srNo: 2, activity: 'Ticket Resolved', date: '27/08/2025 05:00PM', status: 'Resolved', previousStatus: 'Pending', remark: 'SSO login working correctly now', userName: 'IT Security' }
    ]
  },
  {
    srNo: 8,
    ticketId: '7654567884',
    category: 'Operational',
    status: 'Pending',
    raisedOn: '11/09/2025 01:00PM',
    lastUpdatedOn: '12/09/2025 09:00AM',
    subCategory: 'Document Verification',
    subject: 'Batch verification process stuck',
    description: 'Batch document verification stuck at 45% for 2 hours. Batch ID: BV-2025-09-001.',
    supportingDocument: 'batch_status.png',
    priority: 'High',
    reClientName: 'Eastern Finance Corp',
    fiCode: 'FI008',
    raisedBy: 'Operations Team',
    initiator: 'Kevin Martinez',
    assignedTo: 'Batch Processing Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '11/09/2025 01:00PM', status: 'Pending', remark: 'Ticket raised for Operational - Document Verification', userName: 'Operations Team' },
      { srNo: 2, activity: 'Investigation Started', date: '11/09/2025 02:00PM', status: 'Pending', remark: 'Checking batch processing logs', userName: 'Ops Support' }
    ]
  },
  {
    srNo: 9,
    ticketId: '7654567885',
    category: 'Functional',
    status: 'Pending',
    raisedOn: '09/09/2025 04:00PM',
    lastUpdatedOn: '11/09/2025 10:00AM',
    subCategory: 'Search Functionality',
    subject: 'Advanced search filters not working',
    description: 'Date range filter returns incorrect results. Shows August records for Sept filter.',
    supportingDocument: 'search_results.xlsx',
    priority: 'Medium',
    reClientName: 'Sunrise Savings Bank',
    fiCode: 'FI009',
    raisedBy: 'Quality Analyst',
    initiator: 'Lisa Park',
    assignedTo: 'QA Development Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '09/09/2025 04:00PM', status: 'Pending', remark: 'Ticket raised for Functional - Search Functionality', userName: 'Quality Analyst' },
      { srNo: 2, activity: 'Bug Confirmed', date: '10/09/2025 11:00AM', status: 'Pending', remark: 'Confirmed date filter bug', userName: 'QA Team' }
    ]
  },
  {
    srNo: 10,
    ticketId: '7654567886',
    category: 'CERSAI-CKYC Level Queries',
    status: 'Clarification Sought',
    raisedOn: '07/09/2025 11:00AM',
    lastUpdatedOn: '10/09/2025 03:00PM',
    subCategory: 'API Integration',
    subject: 'CKYC API returning timeout errors',
    description: 'CKYC verification API intermittently timing out. Affects 20% of requests.',
    supportingDocument: 'api_logs.json',
    priority: 'High',
    reClientName: 'Unity Financial Group',
    fiCode: 'FI010',
    raisedBy: 'Integration Lead',
    initiator: 'Thomas Wright',
    assignedTo: 'API Integration Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '07/09/2025 11:00AM', status: 'Pending', remark: 'Ticket raised for CERSAI-CKYC Level Queries', userName: 'Integration Lead' },
      { srNo: 2, activity: 'Clarification Requested', date: '10/09/2025 03:00PM', status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Please provide timeout timestamps', userName: 'API Team' }
    ]
  }
];

/**
 * Admin mock tickets with intervention statuses
 */
const adminMockTickets = [
  {
    srNo: 11,
    ticketId: '7654567887',
    category: 'Technical',
    status: 'Re-Opened',
    raisedOn: '01/09/2025 10:00AM',
    lastUpdatedOn: '08/09/2025 02:00PM',
    subCategory: 'Database Connection',
    subject: 'Database connection drops intermittently',
    description: 'Production database connections dropping randomly causing application errors.',
    supportingDocument: 'db_errors.log',
    priority: 'Urgent',
    initiator: 'System Admin',
    assignedTo: 'DBA Team',
    reClientName: 'Apex Financial Services',
    fiCode: 'FI011',
    raisedBy: 'System Admin',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '01/09/2025 10:00AM', status: 'Pending', remark: 'Database connectivity issues reported', userName: 'System Admin' },
      { srNo: 2, activity: 'Ticket Resolved', date: '05/09/2025 04:00PM', status: 'Resolved', previousStatus: 'Pending', remark: 'Connection pool settings adjusted', userName: 'DBA Team' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: '08/09/2025 02:00PM', status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Issue recurring after peak load', userName: 'System Admin' }
    ]
  },
  {
    srNo: 12,
    ticketId: '7654567888',
    category: 'Operational',
    status: 'Clarification Provided',
    raisedOn: '03/09/2025 09:00AM',
    lastUpdatedOn: '09/09/2025 11:00AM',
    subCategory: 'Batch Processing',
    subject: 'End of day batch failing',
    description: 'EOD batch process failing with memory exception.',
    supportingDocument: 'batch_error.txt',
    priority: 'High',
    initiator: 'Batch Operator',
    assignedTo: 'Infra Team',
    reClientName: 'Pacific Banking Corp',
    fiCode: 'FI012',
    raisedBy: 'Batch Operator',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '03/09/2025 09:00AM', status: 'Pending', remark: 'EOD batch failing consistently', userName: 'Batch Operator' },
      { srNo: 2, activity: 'Clarification Requested', date: '05/09/2025 10:00AM', status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Need batch job name and error codes', userName: 'Infra Team' },
      { srNo: 3, activity: 'Clarification Provided', date: '09/09/2025 11:00AM', status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'Job: EOD_RECONCILIATION, Error: OUT_OF_MEMORY', userName: 'Batch Operator' }
    ]
  },
  {
    srNo: 13,
    ticketId: '7654567889',
    category: 'Functional',
    status: 'Assigned to RE',
    raisedOn: '06/09/2025 02:00PM',
    lastUpdatedOn: '10/09/2025 09:00AM',
    subCategory: 'User Interface',
    subject: 'Dashboard widgets not loading',
    description: 'Custom dashboard widgets showing loading spinner indefinitely.',
    supportingDocument: 'dashboard_issue.mp4',
    priority: 'Medium',
    initiator: 'Business User',
    assignedTo: 'Frontend Team',
    reClientName: 'Sterling Finance Ltd',
    fiCode: 'FI013',
    raisedBy: 'Business User',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '06/09/2025 02:00PM', status: 'Pending', remark: 'Dashboard not functioning properly', userName: 'Business User' },
      { srNo: 2, activity: 'Assigned to RE', date: '10/09/2025 09:00AM', status: 'Assigned to RE', previousStatus: 'Pending', remark: 'Assigned to frontend development team', userName: 'Support Manager' }
    ]
  },
  {
    srNo: 14,
    ticketId: '7654567890',
    category: 'Technical',
    status: 'Responded by RE',
    raisedOn: '04/09/2025 11:00AM',
    lastUpdatedOn: '11/09/2025 03:00PM',
    subCategory: 'Security',
    subject: 'SSL certificate expiring soon',
    description: 'Production SSL certificate expires in 7 days. Renewal required.',
    supportingDocument: 'cert_details.pdf',
    priority: 'Urgent',
    initiator: 'Security Team',
    assignedTo: 'DevOps',
    reClientName: 'Horizon Credit Services',
    fiCode: 'FI014',
    raisedBy: 'Security Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '04/09/2025 11:00AM', status: 'Pending', remark: 'Certificate renewal required urgently', userName: 'Security Team' },
      { srNo: 2, activity: 'Assigned to RE', date: '05/09/2025 09:00AM', status: 'Assigned to RE', previousStatus: 'Pending', remark: 'Assigned to DevOps', userName: 'IT Manager' },
      { srNo: 3, activity: 'RE Responded', date: '11/09/2025 03:00PM', status: 'Responded by RE', previousStatus: 'Assigned to RE', remark: 'New certificate generated. Awaiting approval.', userName: 'DevOps' }
    ]
  },
  {
    srNo: 15,
    ticketId: '7654567891',
    category: 'CERSAI-CKYC Level Queries',
    status: 'Pending',
    raisedOn: '12/09/2025 08:00AM',
    lastUpdatedOn: '12/09/2025 08:00AM',
    subCategory: 'Compliance',
    subject: 'KYC document verification pending',
    description: 'Bulk KYC verification request for 500 records pending approval.',
    supportingDocument: 'kyc_batch.csv',
    priority: 'High',
    initiator: 'Compliance Team',
    assignedTo: 'KYC Operations',
    reClientName: 'Pinnacle Banking Group',
    fiCode: 'FI015',
    raisedBy: 'Compliance Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '12/09/2025 08:00AM', status: 'Pending', remark: 'Bulk KYC verification request submitted', userName: 'Compliance Team' }
    ]
  },
  // Re-Opened tickets for Intervene view
  {
    srNo: 16,
    ticketId: '7654567892',
    category: 'Technical',
    status: 'Re-Opened',
    raisedOn: '02/09/2025 09:30AM',
    lastUpdatedOn: '10/09/2025 11:00AM',
    subCategory: 'Network Issues',
    subject: 'VPN connection dropping frequently',
    description: 'VPN disconnects every 15-20 minutes requiring manual reconnection.',
    supportingDocument: 'vpn_logs.txt',
    priority: 'High',
    initiator: 'Remote Team Lead',
    assignedTo: 'Network Team',
    reClientName: 'Coastal Credit Union',
    fiCode: 'FI016',
    raisedBy: 'Remote Team Lead',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '02/09/2025 09:30AM', status: 'Pending', remark: 'VPN connectivity issues reported', userName: 'Remote Team Lead' },
      { srNo: 2, activity: 'Ticket Resolved', date: '05/09/2025 02:00PM', status: 'Resolved', previousStatus: 'Pending', remark: 'Updated VPN client', userName: 'Network Team' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: '10/09/2025 11:00AM', status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Issue persists after update', userName: 'Remote Team Lead' }
    ]
  },
  {
    srNo: 17,
    ticketId: '7654567893',
    category: 'Functional',
    status: 'Clarification Provided',
    raisedOn: '04/09/2025 10:00AM',
    lastUpdatedOn: '11/09/2025 02:30PM',
    subCategory: 'Report Generation',
    subject: 'Monthly reconciliation report mismatch',
    description: 'Totals in monthly reconciliation report do not match transaction summary.',
    supportingDocument: 'recon_report.xlsx',
    priority: 'High',
    initiator: 'Finance Manager',
    assignedTo: 'Reports Team',
    reClientName: 'Heritage Bank Ltd',
    fiCode: 'FI017',
    raisedBy: 'Finance Manager',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '04/09/2025 10:00AM', status: 'Pending', remark: 'Report mismatch identified', userName: 'Finance Manager' },
      { srNo: 2, activity: 'Clarification Requested', date: '06/09/2025 03:00PM', status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Please provide date range', userName: 'Reports Team' },
      { srNo: 3, activity: 'Clarification Provided', date: '11/09/2025 02:30PM', status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'Date range: Sept 1-30, 2025', userName: 'Finance Manager' }
    ]
  },
  {
    srNo: 18,
    ticketId: '7654567894',
    category: 'Operational',
    status: 'Re-Opened',
    raisedOn: '01/09/2025 11:00AM',
    lastUpdatedOn: '09/09/2025 04:00PM',
    subCategory: 'Data Processing',
    subject: 'Duplicate entries in customer database',
    description: 'Batch import created duplicate customer records. Need cleanup.',
    supportingDocument: 'duplicate_list.csv',
    priority: 'Urgent',
    initiator: 'Data Admin',
    assignedTo: 'Database Team',
    reClientName: 'First National Bank',
    fiCode: 'FI018',
    raisedBy: 'Data Admin',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '01/09/2025 11:00AM', status: 'Pending', remark: 'Duplicate records found', userName: 'Data Admin' },
      { srNo: 2, activity: 'Ticket Resolved', date: '04/09/2025 05:00PM', status: 'Resolved', previousStatus: 'Pending', remark: 'Duplicates removed', userName: 'Database Team' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: '09/09/2025 04:00PM', status: 'Re-Opened', previousStatus: 'Resolved', remark: 'New duplicates appeared', userName: 'Data Admin' }
    ]
  },
  {
    srNo: 19,
    ticketId: '7654567895',
    category: 'CERSAI-CKYC Level Queries',
    status: 'Clarification Provided',
    raisedOn: '05/09/2025 02:00PM',
    lastUpdatedOn: '12/09/2025 10:00AM',
    subCategory: 'Data Validation',
    subject: 'CKYC validation failures for bulk upload',
    description: '150 out of 500 CKYC records failing validation.',
    supportingDocument: 'validation_errors.json',
    priority: 'High',
    initiator: 'KYC Analyst',
    assignedTo: 'CKYC Support',
    reClientName: 'Valley Savings Bank',
    fiCode: 'FI019',
    raisedBy: 'KYC Analyst',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '05/09/2025 02:00PM', status: 'Pending', remark: 'Bulk CKYC validation failures', userName: 'KYC Analyst' },
      { srNo: 2, activity: 'Clarification Requested', date: '08/09/2025 11:00AM', status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Please share batch ID', userName: 'CKYC Support' },
      { srNo: 3, activity: 'Clarification Provided', date: '12/09/2025 10:00AM', status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'Batch ID: CKYC-2025-09-001', userName: 'KYC Analyst' }
    ]
  },
  {
    srNo: 20,
    ticketId: '7654567896',
    category: 'Technical',
    status: 'Re-Opened',
    raisedOn: '03/09/2025 08:00AM',
    lastUpdatedOn: '11/09/2025 09:30AM',
    subCategory: 'Authentication',
    subject: 'Two-factor authentication not sending OTP',
    description: 'Users not receiving OTP for 2FA login. SMS gateway may be down.',
    supportingDocument: 'otp_failure_log.pdf',
    priority: 'Urgent',
    initiator: 'Security Admin',
    assignedTo: 'Auth Team',
    reClientName: 'Metro Financial Corp',
    fiCode: 'FI020',
    raisedBy: 'Security Admin',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '03/09/2025 08:00AM', status: 'Pending', remark: 'OTP delivery failures', userName: 'Security Admin' },
      { srNo: 2, activity: 'Ticket Resolved', date: '06/09/2025 12:00PM', status: 'Resolved', previousStatus: 'Pending', remark: 'SMS gateway credentials renewed', userName: 'Auth Team' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: '11/09/2025 09:30AM', status: 'Re-Opened', previousStatus: 'Resolved', remark: 'OTP failures for specific carriers', userName: 'Security Admin' }
    ]
  },
  {
    srNo: 21,
    ticketId: '7654567900',
    category: 'Functional',
    status: 'Clarification Provided',
    raisedOn: '06/09/2025 03:30PM',
    lastUpdatedOn: '12/09/2025 11:00AM',
    subCategory: 'Dashboard',
    subject: 'Widget data refresh not working',
    description: 'Real-time widgets not updating automatically.',
    supportingDocument: 'widget_config.json',
    priority: 'Medium',
    initiator: 'Dashboard Admin',
    assignedTo: 'Frontend Team',
    reClientName: 'Southern Trust Bank',
    fiCode: 'FI021',
    raisedBy: 'Dashboard Admin',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '06/09/2025 03:30PM', status: 'Pending', remark: 'Widget auto-refresh not working', userName: 'Dashboard Admin' },
      { srNo: 2, activity: 'Clarification Requested', date: '09/09/2025 10:00AM', status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Which widgets are affected?', userName: 'Frontend Team' },
      { srNo: 3, activity: 'Clarification Provided', date: '12/09/2025 11:00AM', status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'Transaction Volume, Active Users widgets', userName: 'Dashboard Admin' }
    ]
  },
  {
    srNo: 22,
    ticketId: '7654567901',
    category: 'Operational',
    status: 'Re-Opened',
    raisedOn: '07/09/2025 09:00AM',
    lastUpdatedOn: '12/09/2025 08:00AM',
    subCategory: 'File Processing',
    subject: 'Statement generation failing for large accounts',
    description: 'Account statements with 1000+ transactions failing to generate.',
    supportingDocument: 'statement_error.log',
    priority: 'High',
    initiator: 'Operations Lead',
    assignedTo: 'Backend Team',
    reClientName: 'Central Savings Bank',
    fiCode: 'FI022',
    raisedBy: 'Operations Lead',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '07/09/2025 09:00AM', status: 'Pending', remark: 'Large statement generation failures', userName: 'Operations Lead' },
      { srNo: 2, activity: 'Ticket Resolved', date: '09/09/2025 06:00PM', status: 'Resolved', previousStatus: 'Pending', remark: 'Increased memory allocation', userName: 'Backend Team' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: '12/09/2025 08:00AM', status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Still failing for 5000+ transactions', userName: 'Operations Lead' }
    ]
  },
  {
    srNo: 23,
    ticketId: '7654567902',
    category: 'CERSAI-CKYC Level Queries',
    status: 'Clarification Provided',
    raisedOn: '08/09/2025 01:00PM',
    lastUpdatedOn: '12/09/2025 09:30AM',
    subCategory: 'Integration',
    subject: 'CERSAI search returning stale data',
    description: 'Search results showing data updated 3 days ago. Cache issue suspected.',
    supportingDocument: 'search_comparison.xlsx',
    priority: 'High',
    initiator: 'Integration Analyst',
    assignedTo: 'CERSAI Team',
    reClientName: 'Northern Finance Ltd',
    fiCode: 'FI023',
    raisedBy: 'Integration Analyst',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '08/09/2025 01:00PM', status: 'Pending', remark: 'Stale data in CERSAI search', userName: 'Integration Analyst' },
      { srNo: 2, activity: 'Clarification Requested', date: '10/09/2025 04:00PM', status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Please provide asset IDs', userName: 'CERSAI Team' },
      { srNo: 3, activity: 'Clarification Provided', date: '12/09/2025 09:30AM', status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'Asset IDs: A1234, A5678', userName: 'Integration Analyst' }
    ]
  },
  // Additional tickets for better pagination testing
  {
    srNo: 24,
    ticketId: '7654567903',
    category: 'Technical',
    status: 'Pending',
    raisedOn: '13/09/2025 09:00AM',
    lastUpdatedOn: '13/09/2025 09:00AM',
    subCategory: 'Server Issues',
    subject: 'Application server memory leak detected',
    description: 'Memory usage increasing over time without release.',
    supportingDocument: 'memory_graph.png',
    priority: 'Urgent',
    initiator: 'DevOps Engineer',
    assignedTo: 'Infrastructure Team',
    reClientName: 'Western Union Bank',
    fiCode: 'FI024',
    raisedBy: 'DevOps Engineer',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '13/09/2025 09:00AM', status: 'Pending', remark: 'Memory leak detected in production', userName: 'DevOps Engineer' }
    ]
  },
  {
    srNo: 25,
    ticketId: '7654567904',
    category: 'Operational',
    status: 'Resolved',
    raisedOn: '14/09/2025 10:30AM',
    lastUpdatedOn: '15/09/2025 04:00PM',
    subCategory: 'User Management',
    subject: 'Bulk user provisioning failed',
    description: '50 new user accounts failed to create during onboarding.',
    supportingDocument: 'user_list.xlsx',
    priority: 'High',
    initiator: 'HR Admin',
    assignedTo: 'Identity Management',
    reClientName: 'Atlantic Savings Corp',
    fiCode: 'FI025',
    raisedBy: 'HR Admin',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '14/09/2025 10:30AM', status: 'Pending', remark: 'Bulk user creation failed', userName: 'HR Admin' },
      { srNo: 2, activity: 'Ticket Resolved', date: '15/09/2025 04:00PM', status: 'Resolved', previousStatus: 'Pending', remark: 'Users created successfully after fixing AD sync', userName: 'Identity Management' }
    ]
  },
  {
    srNo: 26,
    ticketId: '7654567905',
    category: 'Functional',
    status: 'Pending',
    raisedOn: '15/09/2025 11:00AM',
    lastUpdatedOn: '15/09/2025 02:00PM',
    subCategory: 'Notifications',
    subject: 'Email notifications not being sent',
    description: 'Users not receiving email alerts for completed transactions.',
    supportingDocument: 'email_logs.txt',
    priority: 'Medium',
    initiator: 'Customer Support',
    assignedTo: 'Email Services Team',
    reClientName: 'Mountain View Credit',
    fiCode: 'FI026',
    raisedBy: 'Customer Support',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '15/09/2025 11:00AM', status: 'Pending', remark: 'Email notification issue reported', userName: 'Customer Support' }
    ]
  },
  {
    srNo: 27,
    ticketId: '7654567906',
    category: 'CERSAI-CKYC Level Queries',
    status: 'Assigned to RE',
    raisedOn: '16/09/2025 08:30AM',
    lastUpdatedOn: '16/09/2025 11:00AM',
    subCategory: 'Document Upload',
    subject: 'CKYC document upload timing out',
    description: 'Large document uploads failing after 30 seconds.',
    supportingDocument: 'upload_error.log',
    priority: 'High',
    initiator: 'Document Processor',
    assignedTo: 'CKYC Technical Team',
    reClientName: 'Lakeshore Financial',
    fiCode: 'FI027',
    raisedBy: 'Document Processor',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '16/09/2025 08:30AM', status: 'Pending', remark: 'Document upload timeout issue', userName: 'Document Processor' },
      { srNo: 2, activity: 'Assigned to RE', date: '16/09/2025 11:00AM', status: 'Assigned to RE', previousStatus: 'Pending', remark: 'Assigned to technical team for investigation', userName: 'Support Manager' }
    ]
  },
  {
    srNo: 28,
    ticketId: '7654567907',
    category: 'Technical',
    status: 'Clarification Sought',
    raisedOn: '17/09/2025 09:15AM',
    lastUpdatedOn: '17/09/2025 03:00PM',
    subCategory: 'API Performance',
    subject: 'REST API response time degradation',
    description: 'API response times increased from 200ms to 2s average.',
    supportingDocument: 'api_metrics.pdf',
    priority: 'Urgent',
    initiator: 'API Gateway Admin',
    assignedTo: 'Performance Team',
    reClientName: 'Riverside Bank',
    fiCode: 'FI028',
    raisedBy: 'API Gateway Admin',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '17/09/2025 09:15AM', status: 'Pending', remark: 'API performance degradation reported', userName: 'API Gateway Admin' },
      { srNo: 2, activity: 'Clarification Requested', date: '17/09/2025 03:00PM', status: 'Clarification Sought', previousStatus: 'Pending', remark: 'Which endpoints are affected?', userName: 'Performance Team' }
    ]
  },
  {
    srNo: 29,
    ticketId: '7654567908',
    category: 'Miscellaneous',
    status: 'Resolved',
    raisedOn: '18/09/2025 10:00AM',
    lastUpdatedOn: '19/09/2025 02:00PM',
    subCategory: 'Documentation',
    subject: 'API documentation outdated',
    description: 'Several endpoints missing from Swagger documentation.',
    supportingDocument: 'missing_endpoints.txt',
    priority: 'Low',
    initiator: 'Technical Writer',
    assignedTo: 'Documentation Team',
    reClientName: 'Coastal Finance Group',
    fiCode: 'FI029',
    raisedBy: 'Technical Writer',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '18/09/2025 10:00AM', status: 'Pending', remark: 'Documentation update needed', userName: 'Technical Writer' },
      { srNo: 2, activity: 'Ticket Resolved', date: '19/09/2025 02:00PM', status: 'Resolved', previousStatus: 'Pending', remark: 'Documentation updated with all endpoints', userName: 'Documentation Team' }
    ]
  },
  {
    srNo: 30,
    ticketId: '7654567909',
    category: 'Operational',
    status: 'Re-Opened',
    raisedOn: '19/09/2025 08:00AM',
    lastUpdatedOn: '21/09/2025 10:00AM',
    subCategory: 'Backup',
    subject: 'Database backup job failing',
    description: 'Nightly database backup failing with storage error.',
    supportingDocument: 'backup_error.log',
    priority: 'Urgent',
    initiator: 'DBA',
    assignedTo: 'Storage Team',
    reClientName: 'Summit Financial Services',
    fiCode: 'FI030',
    raisedBy: 'DBA',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '19/09/2025 08:00AM', status: 'Pending', remark: 'Backup job failure reported', userName: 'DBA' },
      { srNo: 2, activity: 'Ticket Resolved', date: '20/09/2025 05:00PM', status: 'Resolved', previousStatus: 'Pending', remark: 'Storage quota increased', userName: 'Storage Team' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: '21/09/2025 10:00AM', status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Backup still failing with different error', userName: 'DBA' }
    ]
  },
  {
    srNo: 31,
    ticketId: '7654567910',
    category: 'Functional',
    status: 'Clarification Provided',
    raisedOn: '20/09/2025 11:30AM',
    lastUpdatedOn: '22/09/2025 09:00AM',
    subCategory: 'Export',
    subject: 'PDF export corrupted for large reports',
    description: 'Reports with 500+ pages generating corrupted PDF files.',
    supportingDocument: 'corrupted_sample.pdf',
    priority: 'Medium',
    initiator: 'Report User',
    assignedTo: 'Export Services Team',
    reClientName: 'Diamond Trust Bank',
    fiCode: 'FI031',
    raisedBy: 'Report User',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '20/09/2025 11:30AM', status: 'Pending', remark: 'PDF export corruption issue', userName: 'Report User' },
      { srNo: 2, activity: 'Clarification Requested', date: '21/09/2025 02:00PM', status: 'Clarification Sought', previousStatus: 'Pending', remark: 'What report type is affected?', userName: 'Export Services Team' },
      { srNo: 3, activity: 'Clarification Provided', date: '22/09/2025 09:00AM', status: 'Clarification Provided', previousStatus: 'Clarification Sought', remark: 'Transaction history and audit reports', userName: 'Report User' }
    ]
  },
  {
    srNo: 32,
    ticketId: '7654567911',
    category: 'Technical',
    status: 'Pending',
    raisedOn: '21/09/2025 09:45AM',
    lastUpdatedOn: '21/09/2025 02:00PM',
    subCategory: 'Cache',
    subject: 'Redis cache cluster node failure',
    description: 'One of three Redis cluster nodes not responding.',
    supportingDocument: 'redis_status.png',
    priority: 'Urgent',
    initiator: 'Cache Admin',
    assignedTo: 'Platform Team',
    reClientName: 'Emerald Financial',
    fiCode: 'FI032',
    raisedBy: 'Cache Admin',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '21/09/2025 09:45AM', status: 'Pending', remark: 'Redis node failure detected', userName: 'Cache Admin' }
    ]
  },
  {
    srNo: 33,
    ticketId: '7654567912',
    category: 'CERSAI-CKYC Level Queries',
    status: 'Responded by RE',
    raisedOn: '22/09/2025 10:00AM',
    lastUpdatedOn: '23/09/2025 04:00PM',
    subCategory: 'Registration',
    subject: 'CERSAI registration API error codes unclear',
    description: 'Error codes returned by API not documented.',
    supportingDocument: 'error_codes.json',
    priority: 'Medium',
    initiator: 'Integration Developer',
    assignedTo: 'CERSAI Support',
    reClientName: 'Golden Gate Finance',
    fiCode: 'FI033',
    raisedBy: 'Integration Developer',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '22/09/2025 10:00AM', status: 'Pending', remark: 'Error code documentation request', userName: 'Integration Developer' },
      { srNo: 2, activity: 'Assigned to RE', date: '22/09/2025 03:00PM', status: 'Assigned to RE', previousStatus: 'Pending', remark: 'Assigned to support team', userName: 'Support Manager' },
      { srNo: 3, activity: 'RE Responded', date: '23/09/2025 04:00PM', status: 'Responded by RE', previousStatus: 'Assigned to RE', remark: 'Error code documentation attached', userName: 'CERSAI Support' }
    ]
  },
  {
    srNo: 34,
    ticketId: '7654567913',
    category: 'Operational',
    status: 'Closed',
    raisedOn: '23/09/2025 08:30AM',
    lastUpdatedOn: '25/09/2025 11:00AM',
    subCategory: 'Monitoring',
    subject: 'Alert fatigue from false positive alerts',
    description: 'Too many non-critical alerts triggering during normal operations.',
    supportingDocument: 'alert_analysis.xlsx',
    priority: 'Low',
    initiator: 'NOC Team',
    assignedTo: 'Monitoring Team',
    reClientName: 'Silver Spring Bank',
    fiCode: 'FI034',
    raisedBy: 'NOC Team',
    feedback: { rating: 4, comment: 'Good reduction in false alerts.', submittedAt: new Date('2025-09-25T11:00:00') },
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '23/09/2025 08:30AM', status: 'Pending', remark: 'Alert threshold review needed', userName: 'NOC Team' },
      { srNo: 2, activity: 'Ticket Resolved', date: '24/09/2025 05:00PM', status: 'Resolved', previousStatus: 'Pending', remark: 'Alert thresholds adjusted', userName: 'Monitoring Team' },
      { srNo: 3, activity: 'Feedback Submitted', date: '25/09/2025 11:00AM', status: 'Closed', previousStatus: 'Resolved', remark: 'Rating: 4/5', userName: 'NOC Team' }
    ]
  },
  {
    srNo: 35,
    ticketId: '7654567914',
    category: 'Functional',
    status: 'Re-Opened',
    raisedOn: '24/09/2025 09:00AM',
    lastUpdatedOn: '26/09/2025 10:30AM',
    subCategory: 'Authentication',
    subject: 'Session timeout too short for complex transactions',
    description: 'Users being logged out during multi-step transactions.',
    supportingDocument: 'session_feedback.pdf',
    priority: 'Medium',
    initiator: 'UX Team',
    assignedTo: 'Security Team',
    reClientName: 'Oak Tree Financial',
    fiCode: 'FI035',
    raisedBy: 'UX Team',
    auditTrail: [
      { srNo: 1, activity: 'Ticket Created', date: '24/09/2025 09:00AM', status: 'Pending', remark: 'Session timeout complaints from users', userName: 'UX Team' },
      { srNo: 2, activity: 'Ticket Resolved', date: '25/09/2025 03:00PM', status: 'Resolved', previousStatus: 'Pending', remark: 'Session extended to 30 minutes', userName: 'Security Team' },
      { srNo: 3, activity: 'Ticket Re-Opened', date: '26/09/2025 10:30AM', status: 'Re-Opened', previousStatus: 'Resolved', remark: 'Still timing out for some transaction types', userName: 'UX Team' }
    ]
  }
];

/**
 * Seed the database
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing tickets
    console.log('🗑️  Clearing existing tickets...');
    const deleteResult = await Ticket.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} existing tickets\n`);

    // Combine all mock data
    const allTickets = [...mockTickets, ...adminMockTickets];

    // Insert mock tickets
    console.log('📝 Inserting mock tickets...');
    const insertResult = await Ticket.insertMany(allTickets);
    console.log(`   Inserted ${insertResult.length} tickets\n`);

    // Display summary
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║              DATABASE SEEDING COMPLETE                   ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log(`║  Total Tickets: ${insertResult.length.toString().padEnd(40)}║`);
    console.log('║  ─────────────────────────────────────────────────────── ║');

    // Count by status
    const statusCounts = allTickets.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});

    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`║  ${status}: ${count.toString().padEnd(46 - status.length)}║`);
    });

    console.log('╚══════════════════════════════════════════════════════════╝');

    // List all ticket IDs
    console.log('\n📋 Seeded Ticket IDs:');
    insertResult.forEach((ticket, index) => {
      console.log(`   ${index + 1}. ${ticket.ticketId} - ${ticket.status} (${ticket.category})`);
    });

    console.log('\n✅ Seeding completed successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

// Run seeder
seedDatabase();
