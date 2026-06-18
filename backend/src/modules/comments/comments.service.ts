import prisma from '../../config/database';

export class CommentsService {
  static async createComment(params: {
    authorId: string;
    postId: string;
    content: string;
    parentId?: string;
  }) {
    const { authorId, postId, content, parentId } = params;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Post not found');

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId,
        postId,
        ...(parentId ? { parentId } : {}),
      },
      include: {
        author: true,
        ...(parentId ? { parent: true } : {}),
      } as any,
    });

    // increment counters when supported
    const anyPost: any = post;
    const anyPrisma: any = prisma as any;
    if (anyPrisma.post?.update && 'commentsCount' in anyPost) {
      try {
        await prisma.post.update({
          where: { id: postId },
          data: { commentsCount: { increment: 1 } } as any,
        });
      } catch {
        // ignore runtime mismatches
      }
    }

    // create notification when supported
    try {
      if (anyPrisma.notification?.create) {
        const actorName = (comment.author as any)?.username || 'Someone';
        const notificationRecipientId = parentId
          ? (comment as any).parent?.authorId || post.authorId
          : post.authorId;

        const notificationType = parentId ? 'REPLY' : 'COMMENT';
        await (anyPrisma.notification as any).create({
          data: {
            userId: notificationRecipientId,
            type: notificationType,
            actorId: authorId,
            actorName,
            postId,
            commentId: comment.id,
            readAt: null,
          },
        });

        const { getIO } = require('../../config/socket');
        try {
          getIO().to(`user:${notificationRecipientId}`).emit('notification', {
            id: comment.id,
            type: notificationType,
            actorName,
            postId,
            createdAt: new Date().toISOString(),
            message: `${actorName} ${notificationType === 'REPLY' ? 'replied' : 'commented on'} your post`,
          });
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore runtime mismatches
    }

    return comment;
  }

  static async deleteComment(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId }, include: { post: true } });
    if (!comment) throw new Error('Comment not found');

    if (comment.authorId !== userId && comment.post.authorId !== userId) {
      throw new Error('Unauthorized');
    }

    return prisma.comment.delete({ where: { id: commentId } });
  }

  static async getPostComments(postId: string) {
    const allComments = await prisma.comment.findMany({
      where: { postId },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });

    // If threaded schema (parentId) exists, build tree (max 2 levels)
    const threaded = allComments.some((c: any) => 'parentId' in c);
    if (!threaded) return allComments;

    const byParent = new Map<string | null, any[]>();
    for (const c of allComments as any[]) {
      const p = c.parentId ?? null;
      if (!byParent.has(p)) byParent.set(p, []);
      byParent.get(p)!.push(c);
    }

    const build = (parentId: string | null, depth: number): any[] => {
      const list = byParent.get(parentId) || [];
      if (depth >= 2) return list.map((x) => ({ ...x, replies: [] }));
      return list.map((x) => ({
        id: x.id,
        content: x.content,
        createdAt: x.createdAt,
        author: x.author,
        replies: build(x.id, depth + 1),
      }));
    };

    return build(null, 0);
  }
}

