import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { ReputationService } from './reputation.service';
import prisma from '../../config/database';

export class ReputationController {
  static async getMyReputation(req: AuthRequest, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { id: true, username: true, reputation: true }
      });
      
      const level = ReputationService.getReputationLevel(user?.reputation || 0);
      const badges = await ReputationService.getUserBadges(req.userId!);
      
      res.json({
        user,
        level,
        badges,
        nextLevel: ReputationService.getReputationLevel(user?.reputation || 0)
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getUserReputation(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true, reputation: true }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const level = ReputationService.getReputationLevel(user.reputation);
      const badges = await ReputationService.getUserBadges(userId);
      
      res.json({
        user,
        level,
        badges
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getMyBadges(req: AuthRequest, res: Response) {
    try {
      const badges = await ReputationService.getUserBadges(req.userId!);
      res.json(badges);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getUserBadges(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const badges = await ReputationService.getUserBadges(userId);
      res.json(badges);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getLeaderboard(req: AuthRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const leaders = await ReputationService.getLeaderboard(limit);
      res.json(leaders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getMyTransactions(req: AuthRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await prisma.reputationTransaction.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' },
        take: limit
      });
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async calculatePostReputation(req: AuthRequest, res: Response) {
    try {
      const { postId } = req.params;
      
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          likes: true,
          comments: true
        }
      });
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      // Calculate reputation earned from this post
      let reputationEarned = 10; // Base for creating post
      reputationEarned += post.likes.length * 2; // 2 points per like
      reputationEarned += post.comments.length * 3; // 3 points per comment
      
      if (post.likes.length > 100) reputationEarned += 50;
      if (post.comments.length > 50) reputationEarned += 30;
      
      res.json({
        postId,
        likes: post.likes.length,
        comments: post.comments.length,
        reputationEarned,
        breakdown: {
          basePost: 10,
          perLike: post.likes.length * 2,
          perComment: post.comments.length * 3,
          bonus: reputationEarned - (10 + post.likes.length * 2 + post.comments.length * 3)
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}