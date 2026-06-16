import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { SearchService } from './search.service';
import prisma from '../../config/database';

export class SearchController {
  static async globalSearch(req: AuthRequest, res: Response) {
    try {
      const { q, type, limit } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: 'Search query required' });
      }
      
      const results = await SearchService.searchGlobal(q, {
        type: type as any,
        limit: limit ? parseInt(limit as string) : 20
      });
      
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async searchByTechnology(req: AuthRequest, res: Response) {
    try {
      const { technology } = req.params;
      const results = await SearchService.searchByTechnology(technology);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async suggestUsers(req: AuthRequest, res: Response) {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: 'Query required' });
      }
      
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          username: true,
          avatar: true,
          reputation: true
        },
        take: 10
      });
      
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getPopularTags(req: AuthRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      
      // Aggregate tags from recent posts
      const posts = await prisma.post.findMany({
        select: { tags: true },
        take: 1000,
        orderBy: { createdAt: 'desc' }
      });
      
      const tagCount = new Map<string, number>();
      posts.forEach(post => {
        post.tags.forEach(tag => {
          tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
        });
      });
      
      const sortedTags = Array.from(tagCount.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
      
      res.json(sortedTags);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async reindex(req: AuthRequest, res: Response) {
    try {
      // This would trigger a full reindex in Meilisearch or similar
      // For now, just return success
      res.json({ message: 'Reindexing started', timestamp: new Date().toISOString() });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}