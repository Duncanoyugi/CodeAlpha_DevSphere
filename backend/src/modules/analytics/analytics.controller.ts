import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AnalyticsService } from './analytics.service';

export class AnalyticsController {
  static async track(req: AuthRequest, res: Response) {
    try {
      const { action, metadata } = req.body;
      await AnalyticsService.trackActivity(req.userId!, action, metadata);
      res.status(202).json({ message: 'Tracked' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getUserStats(req: AuthRequest, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const stats = await AnalyticsService.getUserStats(req.userId!, days);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getPlatformStats(req: AuthRequest, res: Response) {
    try {
      const stats = await AnalyticsService.getPlatformStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getPostAnalytics(req: AuthRequest, res: Response) {
    try {
      const { postId } = req.params;
      const stats = await AnalyticsService.getPostAnalytics(postId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}