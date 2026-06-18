import prisma from '../../config/database';

export class LikesService {
  static async likePost(userId: string, postId: string) {
    const anyPrisma: any = prisma as any;

    return prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({ where: { id: postId } });
      if (!post) throw new Error('Post not found');

      const existing = await tx.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      if (existing) throw new Error('Already liked');

      const createdLike = await tx.like.create({
        data: { userId, postId },
      });

      const anyPrisma: any = prisma as any;
      let likesCount = 0;
      if (typeof anyPrisma.like?.findMany === 'function') {
        const likes = await tx.like.findMany({ where: { postId }, select: { id: true } })
        likesCount = likes.length;
      }

      if (typeof anyPrisma.post?.update === 'function' && 'likesCount' in (post as any)) {
        await tx.post.update({
          where: { id: postId },
          data: { likesCount },
        });
      }

      return { id: createdLike.id, userId, postId, likesCount };
    });
  }
  
  static async unlikePost(userId: string, postId: string) {
    const anyPrisma: any = prisma as any;

    return prisma.$transaction(async (tx) => {
      const like = await tx.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      if (!like) throw new Error('Like not found');

      await tx.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      // counters
      const post = await tx.post.findUnique({ where: { id: postId } });
      if (post && 'likesCount' in (post as any)) {
        await (tx.post as any).update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        });
      }

      // engagementScore recompute when supported
      const updated = await tx.post.findUnique({ where: { id: postId } });
      if (updated && anyPrisma.post?.update && 'engagementScore' in (updated as any)) {
        const likesCount = (updated as any).likesCount ?? 0;
        const commentsCount = (updated as any).commentsCount ?? 0;
        const sharesCount = (updated as any).sharesCount ?? 0;
        const viewsCount = (updated as any).viewsCount ?? 0;
        const createdAt = (updated as any).createdAt as Date;

        const ageHours = (Date.now() - createdAt.getTime()) / 3600000;
        const decay = Math.pow(ageHours + 2, 1.5);
        const engagementScore =
          (likesCount * 2 + commentsCount * 5 + viewsCount * 0.1 + sharesCount * 10) / (decay || 1);

        if (typeof engagementScore === 'number' && Number.isFinite(engagementScore)) {
          await (tx.post as any).update({ where: { id: postId }, data: { engagementScore } });
        }
      }

      const likes = await tx.like.findMany({ where: { postId }, select: { id: true } })
      const likesCount = likes.length;

      return { unliked: true, likesCount };
    });
  }
  
  static async getPostLikes(postId: string) {
    return prisma.like.findMany({
      where: { postId },
      include: { user: true }
    });
  }
  
  static async hasLiked(userId: string, postId: string) {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });
    return !!like;
  }
}