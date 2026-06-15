import prisma from '../../config/database';

export class FeedService {
  static async getHomeFeed(userId: string, limit: number = 20, cursor?: string) {
    // Get users that the current user follows
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });
    
    const followingIds = following.map(f => f.followingId);
    followingIds.push(userId); // Include user's own posts
    
    // Build query
    const query: any = {
      where: {
        authorId: { in: followingIds }
      },
      include: {
        author: true,
        likes: {
          include: { user: true },
          take: 10
        },
        comments: {
          include: { author: true },
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    };
    
    if (cursor) {
      query.cursor = { id: cursor };
      query.skip = 1;
    }
    
    const posts = await prisma.post.findMany(query);
    
    // Get like status for each post
    const postsWithLikeStatus = await Promise.all(
      posts.map(async (post) => {
        const hasLiked = await prisma.like.findUnique({
          where: {
            userId_postId: {
              userId,
              postId: post.id
            }
          }
        });
        
        return {
          ...post,
          hasLiked: !!hasLiked
        };
      })
    );
    
    return {
      posts: postsWithLikeStatus,
      nextCursor: posts.length === limit ? posts[posts.length - 1].id : undefined
    };
  }
  
  static async getTrendingFeed(limit: number = 20) {
    // Simple trending based on likes + comments in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const posts = await prisma.post.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      include: {
        author: true,
        likes: true,
        comments: true
      },
      orderBy: [
        { likes: { _count: 'desc' } },
        { comments: { _count: 'desc' } },
        { createdAt: 'desc' }
      ],
      take: limit
    });
    
    return posts;
  }
}