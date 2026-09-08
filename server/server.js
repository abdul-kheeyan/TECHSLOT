import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { getJwtSecret } from './config/auth.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  getJwtSecret();
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[Server] techslot.dev API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`[Server] API Base URL: http://localhost:${PORT}/api`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`[Server] Port ${PORT} is already in use. Stop the existing server or set a different PORT in .env.`);
      process.exit(1);
    }
    console.error(`[Server] Failed to start: ${error.message}`);
    process.exit(1);
  });

  // Graceful Shutdown
  const shutdown = (signal) => {
    console.log(`\n[Server] Received ${signal}. Initiating graceful shutdown...`);
    server.close(() => {
      console.log('[Server] HTTP server closed. Bye!');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (err) => {
    console.error(`[Server] Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
