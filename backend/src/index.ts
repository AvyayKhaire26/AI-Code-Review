import 'reflect-metadata';
import express, { Express, Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { routes } from './routes/routes.config';
import { handleValidationErrors } from './middleware/validation.middleware';
import { logger } from './utils/logger.util';
import { initializeDatabase } from './config/database.config';
import { corsConfig } from './config/cors.config';
import './config/inversify.config'; // Initialize DI container

// Load environment variables
config();

const app: Express = express();
const PORT = process.env.PORT || 8080;
const BASE_PATH = '/api/v1';

// ========== Middleware Setup ==========
app.use(helmet()); // Security headers
app.use(cors(corsConfig)); // CORS configuration
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } })); // HTTP logging

// ========== Health Check Route ==========
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ========== Register All Routes ==========
function registerRoutes(): void {
  routes.forEach((route) => {
    const fullPath = BASE_PATH + route.path;

    // Build middleware chain
    const middlewareChain: RequestHandler[] = [
      ...(route.validators || []),
      handleValidationErrors,
      ...(route.middlewares || []),
      asyncHandler(route.controller)
    ];

    const method = route.method.toLowerCase() as keyof Pick<Express, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
    app[method](fullPath, ...middlewareChain);
    logger.info(`Route registered: ${route.method} ${fullPath}`);
  });
}

// ========== Centralized Error Handler ==========
function setupErrorHandler(): void {
  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.path} not found`
    });
  });

  // Global error handler - catches ALL errors
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    logger.error(`Error on ${req.method} ${req.path}: ${message}`, {
      error: err.name,
      stack: err.stack
    });

    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });
}

// ========== Async Handler Wrapper ==========
function asyncHandler(fn: Function): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// ========== Initialize and Start Server ==========
async function startServer(): Promise<void> {
  try {
    // Initialize database connection
    await initializeDatabase();
    logger.info('✅ Database initialized successfully');

    // Register all routes
    registerRoutes();
    logger.info('✅ All routes registered successfully');

    // Setup error handlers (must be last)
    setupErrorHandler();
    logger.info('✅ Error handlers configured');

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Base URL: http://localhost:${PORT}${BASE_PATH}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error: any) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
}

// ========== Graceful Shutdown ==========
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start the server
startServer();
