import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { BookmarksService } from './bookmarks.service';

export class BookmarksController {
  static async toggleBookmark(req: AuthRequest & Request<{ id: string }>, res: Response) {
    try {
      const result = await BookmarksService.toggleBookmark({ userId: req.userId!, postId: req.params.id });
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getBookmarks(req: AuthRequest & Request, res: Response) {
    try {
      const limit = parseInt((req.query.limit as string) || '20');
      const cursor = (req.query.cursor as string) || undefined;

      const { posts, nextCursor } = await BookmarksService.getUserBookmarks({
        userId: req.userId!,
        limit,
        cursor,
      });

      res.json({ posts, nextCursor });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

