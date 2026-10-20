import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.js';

// Load environment variables from server/.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// 1. CORS Configuration for Local Frontend Communication
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);

      // Match allowed origins (default: http://localhost:5173)
      const allowedOrigins = [
        CORS_ORIGIN,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS Error: Origin ${origin} not allowed.`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  })
);

// 2. Body Parsing Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 3. Lightweight Development Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`
    );
  });
  next();
});

// 4. API Routes
app.use('/api', healthRoutes);

// 5. Root route for friendly diagnostic
app.get('/', (req, res) => {
  res.json({
    name: 'Cognipaper Neural Research Lab Backend',
    status: 'online',
    endpoints: {
      health: '/api/health',
      status: '/api/status',
      models: '/api/models',
    },
  });
});

// 6. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Endpoint ${req.method} ${req.originalUrl} does not exist.`,
  });
});

// 7. Global Error Handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('[Server Error]:', err);
  res.status(err.status || 500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected server error occurred.',
  });
});

// 8. Start HTTP Server
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`⚡ Cognipaper Neural Lab Express Backend is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔒 Allowed Frontend Origin: ${CORS_ORIGIN}`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`⚙️  System Status: http://localhost:${PORT}/api/status`);
  console.log(`🧠 Model Discovery: http://localhost:${PORT}/api/models`);
  console.log(`======================================================\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nStopping Cognipaper backend server...');
  server.close(() => {
    console.log('Server stopped cleanly.');
    process.exit(0);
  });
});
