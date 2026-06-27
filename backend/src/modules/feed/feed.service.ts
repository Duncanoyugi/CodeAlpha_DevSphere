import prisma from '../../config/database';

function mapPost(p: any, userId?: string) {
  const liked = (p.likes?.length ?? 0) > 0;
  const bookmarked = (p.bookmarks?.length ?? 0) > 0;
  const reposted = (p.reposts ?? []).some((r: any) => r.userId === userId);
  return {
    ...p,
    likesCount: p.likesCount ?? 0,
    commentsCount: p.commentsCount ?? 0,
    sharesCount: p.sharesCount ?? 0,
    viewsCount: p.viewsCount ?? 0,
    repostsCount: p.repostsCount ?? 0,
    liked,
    bookmarked,
    reposted,
  };
}

export class FeedService {
  static async getHomeFeed(userId: string, limit: number = 20, cursor?: string) {
    const take = Math.max(1, Math.min(50, limit));

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

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
            reposts: {
              include: {
                user: {
                  select: { id: true, username: true, avatar: true },
                },
              },
            },
          },
        },
      },
    };

    if (cursor) {
      query.cursor = { id: cursor };
      query.skip = 1;
    }

    const anyPrisma: any = prisma as any;
    if (!anyPrisma.feedItem?.findMany) {
      const legacy = await prisma.post.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        take: take,
        include: {
          author: true,
          likes: { where: { userId }, select: { id: true } },
          bookmarks: { where: { userId }, select: { id: true } },
          reposts: {
            include: { user: { select: { id: true, username: true, avatar: true } } },
          },
        },
      });
      return { posts: legacy.map((p: any) => mapPost(p, userId)), nextCursor: undefined };
    }

    const items: any[] = await anyPrisma.feedItem.findMany(query);

    const sliced = items.length > take ? items.slice(0, take) : items;
    const nextCursor = items.length > take ? sliced[sliced.length - 1]?.id ?? null : null;

    const posts = sliced.map((item: any) => {
      const p: any = item.post;
      const liked = (p.likes?.length ?? 0) > 0;
      const bookmarked = (p.bookmarks?.length ?? 0) > 0;
      const reposted = (p.reposts ?? []).some((r: any) => r.userId === userId);
      const repostedBy = (p.reposts ?? []).find((r: any) => followingIds.includes(r.userId))?.user ?? null;

      return {
        ...p,
        likesCount: p.likesCount ?? 0,
        commentsCount: p.commentsCount ?? 0,
        sharesCount: p.sharesCount ?? 0,
        viewsCount: p.viewsCount ?? 0,
        repostsCount: p.repostsCount ?? 0,
        liked,
        bookmarked,
        reposted,
        repostedBy,
      };
    });

    return {
      posts,
      nextCursor: nextCursor ?? undefined,
    };
  }

  static async getTrendingFeed(limit: number = 20) {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        _count: {
          select: { likes: true, comments: true }
        },
        reposts: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: Math.max(1, Math.min(50, limit))
    });

    return posts.map((p: any) => mapPost(p));
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
        reposts: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: take,
    });

    const postsWithCounts = await Promise.all(posts.map(async (post) => {
      const [likesCount, commentsCount, repostsCount] = await Promise.all([
        prisma.like.count({ where: { postId: post.id } }),
        prisma.comment.count({ where: { postId: post.id } }),
        prisma.repost.count({ where: { postId: post.id } }),
      ]);
      const reposted = (post.reposts ?? []).some((r: any) => r.userId === userId);
      const repostedBy = (post.reposts ?? []).find((r: any) => followingIds.includes(r.userId))?.user ?? null;
      return {
        ...post,
        likesCount,
        commentsCount,
        repostsCount,
        reposted,
        repostedBy,
      };
    }));

    return {
      posts: postsWithCounts,
      nextCursor: posts.length === take ? posts[posts.length - 1].id : null,
    };
  }
}
