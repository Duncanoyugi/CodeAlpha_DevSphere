import prisma from '../../config/database';
import redis from '../../config/redis';

export class TechnologiesService {
  static async getAllTechnologies() {
    // Get unique tags from posts
    const posts = await prisma.post.findMany({
      select: { tags: true },
      take: 10000
    });
    
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    
    const technologies = Array.from(tagSet).map(tag => ({ name: tag }));
    
    // Get follower counts for each technology
    const techsWithCounts = await Promise.all(
      technologies.map(async (tech) => {
        const followers = await prisma.userTechnologyFollow.count({
          where: { technology: tech.name }
        });
        
        const postCount = await prisma.post.count({
          where: { tags: { has: tech.name } }
        });
        
        return {
          name: tech.name,
          followers,
          postCount
        };
      })
    );
    
    return techsWithCounts.sort((a, b) => b.followers - a.followers);
  }
  
  static async getTechnologyPage(technology: string) {
    // Check cache
    const cacheKey = `technology:${technology}`;
    const cached = redis ? await redis.get(cacheKey) : null;
    if (cached) {
      return JSON.parse(cached);
    }
    
    const [posts, followersCount, experts] = await Promise.all([
      prisma.post.findMany({
        where: { tags: { has: technology } },
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
        orderBy: { createdAt: 'desc' },
        take: 50
      }),
      prisma.userTechnologyFollow.count({
        where: { technology }
      }),
      prisma.userSkill.findMany({
        where: { skill: technology },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
              reputation: true
            }
          }
        },
        orderBy: { user: { reputation: 'desc' } },
        take: 10
      })
    ]);
    
    const result = {
      technology,
      followersCount,
      posts: posts.map(post => ({
        ...post,
        engagementScore: post._count.likes + post._count.comments * 2
      })),
      experts: experts.map(e => e.user)
    };
    
    // Cache for 5 minutes (if Redis enabled)
    if (redis) {
      await redis.set(cacheKey, JSON.stringify(result), 'EX', 300);
    }
    
    return result;
  }
  
  static async followTechnology(userId: string, technology: string) {
    const existing = await prisma.userTechnologyFollow.findUnique({
      where: {
        userId_technology: {
          userId,
          technology
        }
      }
    });
    
    if (existing) {
      throw new Error('Already following this technology');
    }
    
    return prisma.userTechnologyFollow.create({
      data: {
        userId,
        technology
      }
    });
  }
  
  static async unfollowTechnology(userId: string, technology: string) {
    const follow = await prisma.userTechnologyFollow.findUnique({
      where: {
        userId_technology: {
          userId,
          technology
        }
      }
    });
    
    if (!follow) {
      throw new Error('Not following this technology');
    }
    
    return prisma.userTechnologyFollow.delete({
      where: {
        userId_technology: {
          userId,
          technology
        }
      }
    });
  }
  
  static async getFollowedTechnologies(userId: string) {
    return prisma.userTechnologyFollow.findMany({
      where: { userId },
      select: { technology: true }
    });
  }
  
  static async getTrendingTechnologies(limit: number = 10) {
    // Get posts from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentPosts = await prisma.post.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      select: { tags: true }
    });
    
    const tagCount = new Map<string, number>();
    recentPosts.forEach(post => {
      post.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(tagCount.entries())
      .map(([tag, count]) => ({ tag, postCount: count }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, limit);
  }
}