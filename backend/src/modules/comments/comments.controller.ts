import { Request, Response } from 'express';
import { CommentsService } from './comments.service';
import { AuthRequest } from '../../middleware/auth';

export class CommentsController {
  static async createComment(req: AuthRequest, res: Response) {
    try {
      const { postId, content } = req.body;
      const comment = await CommentsService.createComment(req.userId!, postId, content);
      res.status(201).json(comment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async deleteComment(
    req: AuthRequest & Request<{ id: string }>,
    res: Response
  ) {
    try {
      await CommentsService.deleteComment(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async getPostComments(
    req: AuthRequest & Request<{ postId: string }>,
    res: Response
  ) {
    try {
      const comments = await CommentsService.getPostComments(req.params.postId);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}