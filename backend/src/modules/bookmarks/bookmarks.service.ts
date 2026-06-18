import prisma from '../../config/database';

export class BookmarksService {
  static async toggleBookmark(params: {
    userId: string;
    postId: string;
  }): Promise<{ bookmarked: boolean }> {
    const { userId, postId } = params;
    const anyPrisma: any = prisma as any;

    // If Bookmark model isn't present at runtime yet, fail gracefully
    if (!anyPrisma.bookmark?.findUnique) {
      return { bookmarked: false };
    }

    const existing = await anyPrisma.bookmark.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await anyPrisma.bookmark.delete({ where: { userId_postId: { userId, postId } } });
      return { bookmarked: false };
    }

    await anyPrisma.bookmark.create({
      data: { userId, postId },
    });

    return { bookmarked: true };
  }

  static async getUserBookmarks(params: {
    userId: string;
    limit: number;
    cursor?: string;
  }) {
    const { userId, limit, cursor } = params;
    const anyPrisma: any = prisma as any;

    if (!anyPrisma.bookmark?.findMany) {
      return { posts: [], nextCursor: null };
    }

    const take = Math.min(limit, 50);

    const where: any = { userId };

    const rows = await anyPrisma.bookmark.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take,
      include: {
        post: {
          include: {
            author: true,
            likes: true,
            comments: true,
          },
        },
      },
    });

    const posts = rows.map((r: any) => r.post);
    const nextCursor = rows.length === take ? rows[rows.length - 1].id : null;

    return { posts, nextCursor };
  }
}

