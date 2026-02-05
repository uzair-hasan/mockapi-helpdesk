# Helpdesk Mock Backend

A mock Node.js + MongoDB backend for the Helpdesk/Ticket Management system. Designed to simulate real backend behavior for frontend development and validation.

## Features

- RESTful API endpoints matching frontend expectations
- MongoDB integration with proper schemas
- Ticket lifecycle management (create, update, resolve, reopen, clarify)
- Audit trail tracking
- File upload support
- CORS configured for React frontend
- Request/response logging for debugging

## Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** running locally on port 27017
- **npm** or **yarn**

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Default configuration (`.env`):
```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/helpdesk_mock
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

### 3. Start MongoDB

Make sure MongoDB is running locally:

```bash
# Windows - if installed as service, it should be running
# Or start manually:
mongod

# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 4. Seed the Database

Populate the database with mock data:

```bash
npm run seed
```

This creates 15 sample tickets matching the frontend mock data.

### 5. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start at `http://localhost:4000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/tickets` | List tickets (paginated) |
| GET | `/api/tickets/:id` | Get single ticket |
| POST | `/api/tickets` | Create ticket |
| POST | `/api/tickets/:id/feedback` | Submit feedback |
| POST | `/api/tickets/:id/reopen` | Reopen ticket |
| POST | `/api/tickets/:id/clarification` | Provide clarification |
| GET | `/api/tickets/:id/audit-trail` | Get audit trail |
| PATCH | `/api/tickets/:id/status` | Update status (admin) |
| GET | `/api/admin/tickets` | Admin ticket list |
| GET | `/api/tickets/stats` | Statistics |

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint documentation with request/response examples.

## Frontend Integration

### Option 1: Environment Variable

Create or update `.env` in your React app:

```env
REACT_APP_API_BASE_URL=http://localhost:4000/api
```

### Option 2: Update ticketService.ts

In `TicketManagement/services/ticketService.ts`, update the API base URL:

```typescript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';
```

### Option 3: Use the Real API Implementation

The frontend `ticketService.ts` already has commented API implementation code. To switch from mock data to real API calls:

1. Install axios in the frontend: `npm install axios`
2. Uncomment the API implementation sections in each method
3. Remove or comment out the mock data sections

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── ticket.controller.js   # Request handlers
│   ├── models/
│   │   ├── ticket.model.js        # MongoDB schema
│   │   └── index.js               # Model exports
│   ├── routes/
│   │   ├── ticket.routes.js       # Ticket API routes
│   │   ├── admin.routes.js        # Admin API routes
│   │   └── index.js               # Route aggregation
│   ├── services/
│   │   └── ticket.service.js      # Business logic
│   ├── seeders/
│   │   └── ticketSeeder.js        # Database seeder
│   ├── app.js                     # Express app config
│   └── server.js                  # Server entry point
├── uploads/                       # File upload directory
├── .env                           # Environment config
├── .env.example                   # Example config
├── package.json
├── API_DOCUMENTATION.md           # Detailed API docs
└── README.md
```

## Ticket Lifecycle

```
┌──────────┐     ┌────────────────────┐     ┌───────────┐
│  PENDING │────▶│ CLARIFICATION      │────▶│ RESOLVED  │
└──────────┘     │ SOUGHT             │     └───────────┘
     │           └────────────────────┘           │
     │                    ▲                       │
     │                    │                       ▼
     ▼                    │                 ┌───────────┐
┌──────────┐     ┌────────────────────┐     │  CLOSED   │
│ RE-OPENED│◀────│ CLARIFICATION      │     └───────────┘
└──────────┘     │ PROVIDED           │
                 └────────────────────┘
```

### Valid Status Transitions

| From | To |
|------|-----|
| Pending | Resolved, Clarification Sought, Re-Opened |
| Resolved | Re-Opened, Closed |
| Clarification Sought | Resolved, Re-Opened, Clarification Provided |
| Clarification Provided | Resolved, Clarification Sought, Pending |
| Re-Opened | Resolved, Clarification Sought, Pending |
| Closed | (none) |

## Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:4000/api/health

# Get all tickets
curl http://localhost:4000/api/tickets

# Get single ticket
curl http://localhost:4000/api/tickets/7654567897

# Get tickets with filters
curl "http://localhost:4000/api/tickets?status=Pending&category=Technical&page=1&limit=6"

# Submit feedback
curl -X POST http://localhost:4000/api/tickets/7654567898/feedback \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "feedback": "Great support!"}'

# Reopen ticket
curl -X POST http://localhost:4000/api/tickets/7654567898/reopen \
  -H "Content-Type: application/json" \
  -d '{"reason": "Issue Not Resolved", "description": "Problem recurred"}'
```

### Using Postman

Import the following collection or create requests manually:

1. Base URL: `http://localhost:4000/api`
2. Content-Type: `application/json`
3. For file uploads: `multipart/form-data`

## Logs

The server logs all requests with:
- HTTP method and URL
- Request payload (for non-GET requests)
- Response status and timing
- Emoji indicators for easy visual scanning

Example:
```
📨 Request Payload: {"rating": 5, "feedback": "Great!"}
⭐ POST /api/tickets/:ticketId/feedback { ticketId: '7654567898', feedbackData: {...} }
✅ POST /api/tickets/7654567898/feedback - 200 (45ms)
```

## Replacing with Real Backend

This mock backend is designed for easy replacement:

1. **Same API contracts**: Real backend should implement identical endpoints
2. **Same response format**: Use the `ApiResponse<T>` wrapper structure
3. **Same data shapes**: Maintain field names and types
4. **Simple switch**: Update `REACT_APP_API_BASE_URL` to point to real backend

No frontend structural changes required during migration.

## Troubleshooting

### MongoDB Connection Failed

```
❌ MongoDB connection error: connect ECONNREFUSED
```

- Ensure MongoDB is running: `mongod`
- Check if port 27017 is available
- Verify MONGODB_URI in .env

### Port Already in Use

```
❌ Port 4000 is already in use
```

- Change PORT in .env to another value (e.g., 4001)
- Or stop the process using port 4000

### CORS Errors

If you see CORS errors in browser console:

1. Ensure CORS_ORIGIN matches your frontend URL
2. Check that the backend is actually running
3. Try restarting both frontend and backend

## License

This is a development/mock system for internal use.
