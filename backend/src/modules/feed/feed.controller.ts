import { Request, Response } from 'express';
import { FeedService } from './feed.service';
import { AuthRequest } from '../../middleware/auth';

export class FeedController {
  static async getHomeFeed(
    req: AuthRequest & Request<{}, any, any, { limit?: string; cursor?: string }>,
    res: Response
  ) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const cursor = req.query.cursor as string;
      
      const feed = await FeedService.getHomeFeed(req.userId!, limit, cursor);
      res.json(feed);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getTrendingFeed(
    req: Request<{}, any, any, { limit?: string }>,
    res: Response
  ) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const feed = await FeedService.getTrendingFeed(limit);
      res.json(feed);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}