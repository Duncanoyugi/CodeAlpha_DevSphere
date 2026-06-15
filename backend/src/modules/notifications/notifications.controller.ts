import { Response } from 'express';
import { NotificationsService } from './notifications.service';
import { AuthRequest } from '../../middleware/auth';

export class NotificationsController {
  static async getNotifications(req: AuthRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const notifications = await NotificationsService.getNotifications(req.userId!, limit);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async markAsRead(req: AuthRequest, res: Response) {
    try {
      await NotificationsService.markAsRead(req.params.id, req.userId!);
      res.json({ message: 'Marked as read' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      await NotificationsService.markAllAsRead(req.userId!);
      res.json({ message: 'All notifications marked as read' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getUnreadCount(req: AuthRequest, res: Response) {
    try {
      const count = await NotificationsService.getUnreadCount(req.userId!);
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}