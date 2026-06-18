import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import redis from '../../config/redis';
import prisma from '../../config/database';
import { FeedRankingAlgorithm } from './feed.algorithm';
import { feedGenerationQueue } from '../jobs/queue';

export class EnhancedFeedController {
  static async getPersonalizedFeed(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const limit = parseInt(req.query.limit as string) || 20;
      
      // Try cache first
      const cacheKey = `feed:personalized:${userId}:${limit}`;
      // If Redis is disabled, skip cache and compute feed directly
      const cached = redis ? await redis.get(cacheKey) : null;
      
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      // Get user interests
      const userTechFollows = await prisma.userTechnologyFollow.findMany({
        where: { userId },
        select: { technology: true }
      });
      
      const interests = userTechFollows.map(f => f.technology);
      
      const userSkills = await prisma.userSkill.findMany({
        where: { userId },
        select: { skill: true }
      });
      
      const skills = userSkills.map(s => s.skill);
      
      // Get following users
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true }
      });
      
      const followingIds = following.map(f => f.followingId);
      
      // Fetch posts with scores
      let posts = await prisma.post.findMany({
        where: {
          OR: [
            { authorId: { in: [...followingIds, userId] } },
            { tags: { hasSome: interests } },
            { tags: { hasSome: skills } }
          ]
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
              reputation: true
            }
          },
          _count: {
            select: { likes: true, comments: true }
          }
        },
        take: 50
      });
      
      // Calculate scores
      const scoredPosts = posts.map(post => ({
        ...post,
      hotnessScore: FeedRankingAlgorithm.calculateHotnessScore({
        id: post.id,
        likes: post._count.likes,
        comments: post._count.comments,
        shares: post.sharesCount || 0,
        views: post.viewsCount || 0,
          createdAt: post.createdAt,
          authorId: post.author.id,
          authorReputation: post.author.reputation || 0,
          tags: post.tags
        }),
        trendingScore: FeedRankingAlgorithm.calculateTrendingScore({
          id: post.id,
          likes: post._count.likes,
          comments: post._count.comments,
          shares: post.sharesCount || 0,
          views: post.viewsCount || 0,
          createdAt: post.createdAt,
          authorId: post.author.id,
          authorReputation: post.author.reputation || 0,
          tags: post.tags
        })
      }));
      
      // Sort by combined score
      const sortedPosts = scoredPosts.sort((a, b) => {
        const scoreA = a.hotnessScore * 0.7 + a.trendingScore * 0.3;
        const scoreB = b.hotnessScore * 0.7 + b.trendingScore * 0.3;
        return scoreB - scoreA;
      }).slice(0, limit);
      
      // Cache for 2 minutes (if Redis enabled)
      if (redis) {
        await redis.set(cacheKey, JSON.stringify(sortedPosts), 'EX', 120);
      }
      
      // Queue background job to refresh feed
      await feedGenerationQueue.add('refresh-feed', { userId, limit });
      
      res.json({
        posts: sortedPosts,
        hasMore: posts.length > limit
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async trackPostView(req: AuthRequest, res: Response) {
    try {
      const { postId } = req.params;
      const userId = req.userId!;

      const ip = req.ip;
      const userAgent = req.get('user-agent');
      
      // Track view asynchronously (don't await)
      prisma.postView.create({
        data: {
          postId,
          userId,
          ipAddress: ip,
          userAgent
        }
      }).then(() => {
        // Update post view count
        prisma.post.update({
          where: { id: postId },
          data: { viewsCount: { increment: 1 } }
        });
      }).catch(console.error);
      
      res.status(202).json({ message: 'View tracked' });
    } catch (error) {
      res.status(500).json({ message: 'Error tracking view' });
    }
  }
}