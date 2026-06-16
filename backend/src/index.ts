import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import dotenv from 'dotenv';

dotenv.config();

import { createServer } from 'http';
import { initializeRedis } from './config/redis';
import { initializeWorkers } from './modules/jobs/queue';
import { initializeSocket } from './config/socket';
import { initializeDatabase } from './config/database';
import prisma from './config/database';
import { authRateLimit, strictRateLimit } from './middleware/rateLimit';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import postRoutes from './modules/posts/posts.routes';
import commentRoutes from './modules/comments/comments.routes';
import likeRoutes from './modules/likes/likes.routes';
import followRoutes from './modules/follows/follows.routes';
import feedRoutes from './modules/feed/feed.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import reputationRoutes from './modules/reputation/reputation.routes';
import searchRoutes from './modules/search/search.routes';
import technologyRoutes from './modules/technologies/technologies.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';




const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize services
const isRedisEnabled = process.env.REDIS_ENABLED !== 'false';

// Avoid any Redis/bullmq connection attempts when disabled.
void (async () => {
  try {
    await initializeDatabase();
    if (isRedisEnabled) {
      await Promise.all([initializeRedis(), initializeWorkers()]);
    }
    console.log('✅ All services initialized');
  } catch (e) {
    console.error('❌ Service initialization failed:', e);
  }
})();

// Initialize Socket.io
initializeSocket(server);

// Middleware
app.use(compression());
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

// Rate limiting for auth routes
app.use('/api/auth', authRateLimit);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reputation', reputationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/technologies', technologyRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check with service status
app.get('/health', async (req, res) => {
  const isRedisEnabled = process.env.REDIS_ENABLED !== 'false';
  let redisOk = false;

  if (isRedisEnabled) {
    const { redis } = require('./config/redis');
    redisOk = redis ? await redis.ping().then((r: string) => r === 'PONG').catch(() => false) : false;
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      redis: redisOk,
      postgres: true,
      workers: isRedisEnabled
    }
  });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket ready`);
  console.log(`⚡ Redis connected`);
  console.log(`📦 BullMQ workers running`);
});