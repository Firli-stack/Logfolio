import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Core Middlewares
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

// 2. Global Rate Limiter (NFR-11)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// 3. Health Check Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Logfolio API Server',
    version: '1.0.0',
  });
});

// 4. API Routes
import apiRouter from './routes/api.js';
app.use('/api/v1', apiRouter);

// 5. Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Logfolio Server running at http://localhost:${PORT}`);
  console.log(`📡 Accepting requests from ${CLIENT_URL}`);
});

export default app;
