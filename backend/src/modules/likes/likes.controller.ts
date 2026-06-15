import { Request, Response } from 'express';
import { LikesService } from './likes.service';
import { AuthRequest } from '../../middleware/auth';

export class LikesController {
  static async likePost(req: AuthRequest, res: Response) {
    try {
      const like = await LikesService.likePost(req.userId!, req.params.postId);
      res.status(201).json(like);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async unlikePost(req: AuthRequest, res: Response) {
    try {
      await LikesService.unlikePost(req.userId!, req.params.postId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async getPostLikes(
    req: AuthRequest & Request<{ postId: string }>,
    res: Response
  ) {
    try {
      const likes = await LikesService.getPostLikes(req.params.postId);
      res.json(likes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async hasLiked(
    req: AuthRequest & Request<{ postId: string }>,
    res: Response
  ) {
    try {
      const hasLiked = await LikesService.hasLiked(req.userId!, req.params.postId);
      res.json({ hasLiked });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}