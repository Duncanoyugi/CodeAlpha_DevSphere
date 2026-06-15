import prisma from '../../config/database';

export class PostsService {
  static async createPost(authorId: string, data: {
    title: string;
    content: string;
    imageUrl?: string;
    tags?: string[];
  }) {
    return prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        tags: data.tags || [],
        authorId
      },
      include: {
        author: true,
        likes: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }
  
  static async getPost(postId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        likes: {
          include: { user: true }
        },
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!post) throw new Error('Post not found');
    return post;
  }
  
  static async updatePost(postId: string, userId: string, data: {
    title?: string;
    content?: string;
    imageUrl?: string;
    tags?: string[];
  }) {
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) throw new Error('Post not found');
    if (post.authorId !== userId) throw new Error('Unauthorized');
    
    return prisma.post.update({
      where: { id: postId },
      data,
      include: { author: true }
    });
  }
  
  static async deletePost(postId: string, userId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) throw new Error('Post not found');
    if (post.authorId !== userId) throw new Error('Unauthorized');
    
    return prisma.post.delete({
      where: { id: postId }
    });
  }
  
  static async getUserPosts(userId: string) {
    return prisma.post.findMany({
      where: { authorId: userId },
      include: {
        author: true,
        likes: true,
        comments: {
          include: { author: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
  
  static async getPostsByTag(tag: string) {
    return prisma.post.findMany({
      where: {
        tags: { has: tag }
      },
      include: {
        author: true,
        likes: true,
        comments: {
          include: { author: true },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}