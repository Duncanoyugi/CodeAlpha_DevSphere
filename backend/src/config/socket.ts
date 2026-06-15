import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

let io: SocketServer;

export const initializeSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true
    }
  });
  
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });
  
  io.on('connection', (socket: Socket) => {
    console.log(`User ${socket.data.userId} connected`);
    
    socket.join(`user:${socket.data.userId}`);
    
    socket.on('disconnect', () => {
      console.log(`User ${socket.data.userId} disconnected`);
    });
  });
  
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};