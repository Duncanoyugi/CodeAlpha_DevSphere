import prisma from '../../config/database';

export class CommentsService {
  static async createComment(authorId: string, postId: string, content: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) throw new Error('Post not found');
    
    return prisma.comment.create({
      data: {
        content,
        authorId,
        postId
      },
      include: {
        author: true
      }
    });
  }
  
  static async deleteComment(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { post: true }
    });
    
    if (!comment) throw new Error('Comment not found');
    if (comment.authorId !== userId && comment.post.authorId !== userId) {
      throw new Error('Unauthorized');
    }
    
    return prisma.comment.delete({
      where: { id: commentId }
    });
  }
  
  static async getPostComments(postId: string) {
    return prisma.comment.findMany({
      where: { postId },
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}