import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import postRoutes from './modules/posts/posts.routes';
import commentRoutes from './modules/comments/comments.routes';
import likeRoutes from './modules/likes/likes.routes';
import followRoutes from './modules/follows/follows.routes';
import feedRoutes from './modules/feed/feed.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import { errorHandler } from './middleware/errorHandler';
import { initializeSocket } from './config/socket';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
initializeSocket(server);

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket ready`);
});