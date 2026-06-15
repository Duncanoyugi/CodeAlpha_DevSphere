import prisma from '../../config/database';
import { getIO } from '../../config/socket';

export class NotificationsService {
  static async createNotification(data: {
    userId: string;
    type: string;
    actorId: string;
    actorName: string;
    postId?: string;
    commentId?: string;
  }) {
    const notification = await prisma.notification.create({
      data
    });
    
    // Emit real-time notification
    const io = getIO();
    io.to(`user:${data.userId}`).emit('new_notification', notification);
    
    return notification;
  }
  
  static async getNotifications(userId: string, limit: number = 50) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
  
  static async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId
      }
    });
    
    if (!notification) throw new Error('Notification not found');
    
    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });
  }
  
  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        read: false
      },
      data: { read: true }
    });
  }
  
  static async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        read: false
      }
    });
  }
}