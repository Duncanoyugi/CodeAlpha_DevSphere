import prisma from '../../config/database';

export class RepostsService {
  static async toggleRepost(userId: string, postId: string) {
    const anyPrisma: any = prisma as any;

    if (!anyPrisma.repost?.findUnique) {
      throw new Error('Repost feature is not available');
    }

    const existing = await anyPrisma.repost.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await anyPrisma.repost.delete({
        where: { userId_postId: { userId, postId } },
      });

      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (post && 'repostsCount' in post) {
        await prisma.post.update({
          where: { id: postId },
          data: { repostsCount: { decrement: 1 } },
        });
      }

      return { reposted: false };
    }

    await anyPrisma.repost.create({
      data: { userId, postId },
    });

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (post && 'repostsCount' in post) {
      await prisma.post.update({
        where: { id: postId },
        data: { repostsCount: { increment: 1 } },
      });
    }

    return { reposted: true };
  }

  static async getPostReposts(postId: string) {
    const anyPrisma: any = prisma as any;
    if (!anyPrisma.repost?.findMany) {
      return [];
    }

    return anyPrisma.repost.findMany({
      where: { postId },
      include: { user: { select: { id: true, username: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async hasReposted(userId: string, postId: string) {
    const anyPrisma: any = prisma as any;
    if (!anyPrisma.repost?.findUnique) {
      return false;
    }

    const repost = await anyPrisma.repost.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    return !!repost;
  }
}
