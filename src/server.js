/**
 * Server Entry Point
 *
 * Starts the Express server and connects to MongoDB.
 * This is the main entry point for the application.
 */

require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

// Configuration
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk_mock';

// MongoDB connection options
const mongoOptions = {
  // Modern MongoDB driver settings
};

/**
 * Connect to MongoDB
 */
async function connectDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log(`   URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);

    await mongoose.connect(MONGODB_URI, mongoOptions);

    console.log('✅ MongoDB connected successfully');

    // Log database info
    const dbName = mongoose.connection.db.databaseName;
    console.log(`   Database: ${dbName}`);

    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
}

/**
 * Handle MongoDB connection events
 */
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('🚨 MongoDB error:', err.message);
});

/**
 * Graceful shutdown handler
 */
async function shutdown(signal) {
  console.log(`\n📴 ${signal} received. Starting graceful shutdown...`);

  try {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

/**
 * Start the server
 */
async function startServer() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║          HELPDESK MOCK BACKEND - Starting...             ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');

  // Connect to database
  const dbConnected = await connectDatabase();

  if (!dbConnected) {
    console.error('\n⚠️  Starting server without database connection...');
    console.error('   Some features may not work properly.\n');
  }

  // Start Express server
  const server = app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║               SERVER STARTED SUCCESSFULLY                ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log(`║  🌐 Server URL:    http://localhost:${PORT}                   ║`);
    console.log(`║  📡 API Base:      http://localhost:${PORT}/api               ║`);
    console.log(`║  🏥 Health Check:  http://localhost:${PORT}/api/health        ║`);
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log('║  AVAILABLE ENDPOINTS:                                    ║');
    console.log('║  ─────────────────────────────────────────────────────── ║');
    console.log('║  GET    /api/tickets              List tickets           ║');
    console.log('║  GET    /api/tickets/:id          Get ticket by ID       ║');
    console.log('║  POST   /api/tickets              Create ticket          ║');
    console.log('║  POST   /api/tickets/:id/feedback Submit feedback        ║');
    console.log('║  POST   /api/tickets/:id/reopen   Reopen ticket          ║');
    console.log('║  POST   /api/tickets/:id/clarification Provide clarify   ║');
    console.log('║  GET    /api/tickets/:id/audit-trail Get audit trail     ║');
    console.log('║  PATCH  /api/tickets/:id/status   Update status (admin)  ║');
    console.log('║  GET    /api/admin/tickets        Admin ticket list      ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('📝 Press Ctrl+C to stop the server');
    console.log('');
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use`);
      console.error('   Try using a different port or stop the other process');
    } else {
      console.error('❌ Server error:', error);
    }
    process.exit(1);
  });

  return server;
}

// Start the application
startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
