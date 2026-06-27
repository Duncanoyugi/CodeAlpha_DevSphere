import { Request, Response } from 'express';
import { RepostsService } from './reposts.service';
import { AuthRequest } from '../../middleware/auth';

export class RepostsController {
  static async toggleRepost(req: AuthRequest & Request<{ postId: string }>, res: Response) {
    try {
      const result = await RepostsService.toggleRepost(req.userId!, req.params.postId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to toggle repost' });
    }
  }

  static async getPostReposts(req: Request & { params: { postId: string } }, res: Response) {
    try {
      const reposts = await RepostsService.getPostReposts(req.params.postId);
      res.json(reposts);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to fetch reposts' });
    }
  }
}
