import prisma from '../../config/database';

export class LikesService {
  static async likePost(userId: string, postId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) throw new Error('Post not found');
    
    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });
    
    if (existing) {
      throw new Error('Already liked');
    }
    
    return prisma.like.create({
      data: {
        userId,
        postId
      },
      include: {
        user: true,
        post: {
          include: { author: true }
        }
      }
    });
  }
  
  static async unlikePost(userId: string, postId: string) {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });
    
    if (!like) throw new Error('Like not found');
    
    return prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
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