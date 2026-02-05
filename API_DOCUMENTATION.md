# Helpdesk Mock Backend - API Documentation

## Overview

This mock backend provides REST APIs for the Helpdesk/Ticket Management system. It simulates real backend behavior for frontend development and validation.

**Base URL:** `http://localhost:4000/api`

**Frontend Base URL:** `http://localhost:3000/ckyc`

---

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "meta": {
    "timestamp": "2025-09-12T10:00:00.000Z",
    "pagination": { ... }
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error description",
  "message": "User-friendly error message",
  "meta": {
    "timestamp": "2025-09-12T10:00:00.000Z"
  }
}
```

---

## Endpoints

### Health Check

#### `GET /api/health`

Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "Helpdesk Mock API is running",
  "timestamp": "2025-09-12T10:00:00.000Z",
  "version": "1.0.0"
}
```

---

### Tickets

#### `GET /api/tickets`

Get paginated list of tickets with optional filters.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number (1-based) |
| limit | number | 10 | Items per page |
| status | string | - | Filter by status |
| category | string | - | Filter by category |
| search | string | - | Search in subject, description, ticketId |
| sortField | string | raisedOn | Field to sort by |
| sortOrder | string | desc | Sort order (asc/desc) |

**Example Request:**
```
GET /api/tickets?page=1&limit=6&status=Pending&category=Technical
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "ticketId": "7654567897",
        "srNo": 1,
        "category": "Technical",
        "subCategory": "System Performance",
        "subject": "System running slowly after update",
        "description": "After the latest software update...",
        "status": "Pending",
        "priority": "High",
        "raisedOn": "10/09/2025 10:00AM",
        "lastUpdatedOn": "12/09/2025 12:00AM",
        "supportingDocument": "system_log.pdf",
        "auditTrail": [...]
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 6,
    "totalPages": 3,
    "hasMore": true,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "message": "Tickets retrieved successfully"
}
```

---

#### `GET /api/tickets/:ticketId`

Get a single ticket by ID.

**Example Request:**
```
GET /api/tickets/7654567897
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticketId": "7654567897",
    "srNo": 1,
    "category": "Technical",
    "subCategory": "System Performance",
    "subject": "System running slowly after update",
    "description": "After the latest software update, my system has been experiencing significant slowdowns...",
    "status": "Pending",
    "priority": "High",
    "raisedOn": "10/09/2025 10:00AM",
    "lastUpdatedOn": "12/09/2025 12:00AM",
    "supportingDocument": "system_log.pdf",
    "auditTrail": [
      {
        "srNo": 1,
        "activity": "Ticket Created",
        "date": "10/09/2025 10:00AM",
        "status": "Pending",
        "remark": "Ticket raised for Technical - System Performance",
        "userName": "John Doe"
      }
    ]
  },
  "message": "Ticket retrieved successfully"
}
```

---

#### `POST /api/tickets`

Create a new ticket.

**Request Body:**
```json
{
  "category": "Technical",
  "subCategory": "System Performance",
  "subject": "New issue description",
  "description": "Detailed description of the issue...",
  "priority": "High",
  "initiator": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticketId": "7654567892",
    "srNo": 16,
    "category": "Technical",
    "subCategory": "System Performance",
    "subject": "New issue description",
    "status": "Pending",
    "raisedOn": "12/09/2025 02:30PM",
    "lastUpdatedOn": "12/09/2025 02:30PM",
    "auditTrail": [...]
  },
  "message": "Ticket created successfully"
}
```

---

#### `POST /api/tickets/:ticketId/feedback`

Submit feedback for a resolved ticket. This closes the ticket.

**Request Body:**
```json
{
  "rating": 5,
  "feedback": "Excellent support, issue resolved quickly!"
}
```

**Request with file upload (multipart/form-data):**
- `rating`: number (1-5)
- `feedback`: string
- `documents`: File[] (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "ticketId": "7654567898",
    "status": "Closed",
    "message": "Feedback submitted successfully"
  },
  "message": "Feedback submitted successfully"
}
```

---

#### `POST /api/tickets/:ticketId/reopen`

Reopen a resolved ticket.

**Request Body:**
```json
{
  "reason": "Issue Not Resolved",
  "description": "The problem has reoccurred after the initial fix."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticketId": "7654567898",
    "status": "Re-Opened",
    "message": "Ticket reopened successfully"
  },
  "message": "Ticket reopened successfully"
}
```

---

#### `POST /api/tickets/:ticketId/clarification`

Provide clarification when requested.

**Request Body:**
```json
{
  "clarification": "Here is the additional information requested: The error occurs specifically when..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticketId": "7654567899",
    "status": "Clarification Provided",
    "message": "Clarification provided successfully"
  },
  "message": "Clarification provided successfully"
}
```

---

#### `GET /api/tickets/:ticketId/audit-trail`

Get the audit trail for a ticket.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "srNo": 1,
      "activity": "Ticket Created",
      "date": "10/09/2025 10:00AM",
      "status": "Pending",
      "remark": "Ticket raised for Technical - System Performance",
      "userName": "John Doe"
    },
    {
      "srNo": 2,
      "activity": "Assigned to Support Team",
      "date": "10/09/2025 02:30PM",
      "status": "Pending",
      "remark": "Ticket assigned to technical support team",
      "userName": "Support Manager"
    }
  ],
  "message": "Audit trail retrieved successfully"
}
```

---

#### `GET /api/tickets/:ticketId/download/:documentId`

Download a document attachment (mock implementation).

**Response:**
```json
{
  "success": true,
  "message": "Document download endpoint - mock implementation",
  "data": {
    "ticketId": "7654567897",
    "documentId": "doc123",
    "downloadUrl": "/uploads/doc123"
  }
}
```

---

### Admin Endpoints

#### `PATCH /api/tickets/:ticketId/status`

Update ticket status (Admin action).

**Request Body:**
```json
{
  "status": "Resolved",
  "remarks": "Issue has been resolved. Please verify.",
  "adminUser": "Admin Name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ticketId": "7654567897",
    "status": "Resolved",
    "previousStatus": "Pending",
    "message": "Ticket status updated to \"Resolved\""
  },
  "message": "Ticket status updated to \"Resolved\""
}
```

---

#### `POST /api/tickets/:ticketId/resolve`

Resolve a ticket (Admin action).

**Request Body:**
```json
{
  "resolution": "Applied fix XYZ which resolved the issue.",
  "adminUser": "Tech Support"
}
```

---

#### `POST /api/tickets/:ticketId/request-clarification`

Request clarification from user (Admin action).

**Request Body:**
```json
{
  "question": "Please provide more details about when the error occurs.",
  "adminUser": "Support Agent"
}
```

---

#### `GET /api/admin/tickets`

Get tickets for admin views with admin-specific fields.

**Query Parameters:** Same as `GET /api/tickets`

**Response includes additional fields:**
- `ticketAge`: Calculated age from raised date
- `initiator`: User who raised the ticket
- `assignedTo`: Assigned team/person

---

#### `GET /api/tickets/stats`

Get ticket statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 15,
    "byStatus": {
      "pending": 4,
      "resolved": 3,
      "clarificationSought": 3,
      "reopened": 1,
      "closed": 1
    }
  },
  "message": "Statistics retrieved successfully"
}
```

---

## Data Types

### Ticket Status Values

| Status | Description |
|--------|-------------|
| `Pending` | Ticket is open and awaiting action |
| `Resolved` | Ticket has been resolved |
| `Clarification Sought` | Admin requested more information |
| `Clarification Provided` | User provided requested information |
| `Re-Opened` | Previously resolved ticket reopened |
| `Responded by RE` | RE has responded to the ticket |
| `Assigned to RE` | Ticket assigned to RE |
| `Closed` | Ticket is closed (after feedback) |

### Ticket Categories

- `Technical`
- `Operational`
- `Functional`
- `Miscellaneous`
- `CERSAI-CKYC Level Queries`

### Priority Levels

- `Low`
- `Medium`
- `High`
- `Urgent`

### Valid Status Transitions

```
Pending → Resolved, Clarification Sought, Re-Opened
Resolved → Re-Opened, Closed
Clarification Sought → Resolved, Re-Opened, Clarification Provided
Clarification Provided → Resolved, Clarification Sought, Pending
Re-Opened → Resolved, Clarification Sought, Pending
Closed → (no transitions allowed)
```

---

## File Upload

File uploads use `multipart/form-data` format.

**Constraints:**
- Maximum file size: 5MB
- Allowed types: `.jpg`, `.jpeg`, `.png`, `.pdf`, `.xlsx`, `.json`, `.mp4`
- Field name for files: `documents`

---

## Frontend Integration

### Update Frontend API Base URL

In your React application, update the environment variable:

```env
REACT_APP_API_BASE_URL=http://localhost:4000/api
```

Or update `ticketService.ts`:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';
```

### CORS

The backend is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:3001`

---

## Running the Backend

### Prerequisites

- Node.js >= 18
- MongoDB running locally on port 27017

### Installation

```bash
cd backend
npm install
```

### Seed Database

```bash
npm run seed
```

### Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### Server URLs

- API Base: `http://localhost:4000/api`
- Health Check: `http://localhost:4000/api/health`
- Tickets: `http://localhost:4000/api/tickets`

---

## Replacing with Real Backend

This mock backend is designed for easy replacement:

1. **Same API contracts**: Real backend should implement the same endpoints
2. **Same response format**: Maintain the `ApiResponse<T>` wrapper structure
3. **Same data shapes**: Use the same field names and types
4. **Update base URL**: Just change `REACT_APP_API_BASE_URL` to point to real backend

The frontend `ticketService.ts` is already designed for this migration - no structural changes needed.
