import prisma from '../../config/database';

export class FeedService {
  static async getHomeFeed(userId: string, limit: number = 20, cursor?: string) {
    const take = Math.max(1, Math.min(50, limit));

    const query: any = {
      where: { userId },
      orderBy: [
        { score: 'desc' },
        { createdAt: 'desc' },
      ],
      take: take + 1,
      include: {
        post: {
          include: {
            author: true,
            likes: {
              where: { userId },
              select: { id: true },
            },
            bookmarks: {
              where: { userId },
              select: { id: true },
            },
          },
        },
      },
    };

    if (cursor) {
      query.cursor = { id: cursor };
      query.skip = 1;
    }

    // Prisma client type may not yet include FeedItem in some environments.
    // Keep logic behind a runtime-safe access.
    const anyPrisma: any = prisma as any;
    if (!anyPrisma.feedItem?.findMany) {
      // Fallback to legacy behavior for now
      const legacy = await prisma.post.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        take: take,
      });
      return { posts: legacy, nextCursor: undefined };
    }

    const items: any[] = await anyPrisma.feedItem.findMany(query);

    const sliced = items.length > take ? items.slice(0, take) : items;
    const nextCursor = items.length > take ? sliced[sliced.length - 1]?.id ?? null : null;

    const posts = sliced.map((item: any) => {
      const p: any = item.post;
      const liked = (p.likes?.length ?? 0) > 0;
      const bookmarked = (p.bookmarks?.length ?? 0) > 0;

      return {
        ...p,
        likesCount: p.likesCount ?? 0,
        commentsCount: p.commentsCount ?? 0,
        sharesCount: p.sharesCount ?? 0,
        viewsCount: p.viewsCount ?? 0,
        liked,
        bookmarked,
      };
    });

    return {
      posts,
      nextCursor: nextCursor ?? undefined,
    };
  }
  
  static async getTrendingFeed(limit: number = 20) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const posts = await prisma.post.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      include: {
        author: true,
        _count: {
          select: { likes: true, comments: true }
        }
      },
      orderBy: [
        { likes: { _count: 'desc' } },
        { comments: { _count: 'desc' } },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return posts.map((p: any) => ({
      ...p,
      likesCount: p._count?.likes ?? 0,
      commentsCount: p._count?.comments ?? 0,
    }));
  }

  static async getDevelopersFeed(userId: string, limit: number = 20) {
    const take = Math.max(1, Math.min(50, limit));

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    if (followingIds.length === 0) {
      return { posts: [], nextCursor: null };
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: followingIds }
      },
      include: {
        author: true,
      },
      orderBy: { createdAt: 'desc' },
      take: take,
    });

    const postsWithCounts = await Promise.all(posts.map(async (post) => {
      const [likesCount, commentsCount] = await Promise.all([
        prisma.like.count({ where: { postId: post.id } }),
        prisma.comment.count({ where: { postId: post.id } }),
      ]);
      return {
        ...post,
        likesCount,
        commentsCount,
      };
    }));

    return {
      posts: postsWithCounts,
      nextCursor: posts.length === take ? posts[posts.length - 1].id : null,
    };
  }
}