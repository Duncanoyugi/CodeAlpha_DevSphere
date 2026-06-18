import prisma from '../../config/database';

export class PostsService {
  static async createPost(authorId: string, data: {
    title: string;
    content: string;
    imageUrl?: string;
    tags?: string[];
    [key: string]: any;
  }) {
    const { title, content, imageUrl, tags } = data;

    if (!title || !title.trim()) {
      throw new Error('Title is required');
    }
    if (!content || !content.trim()) {
      throw new Error('Content is required');
    }

    const finalImageUrl = typeof imageUrl === 'string' && imageUrl.startsWith('data:image/')
      ? imageUrl
      : undefined;

    const MAX_IMAGE_LENGTH = 700_000;
    if (finalImageUrl && finalImageUrl.length > MAX_IMAGE_LENGTH) {
      throw new Error('Image is too large. Please use an image under ~500KB.');
    }

    const finalTags = Array.isArray(tags) ? tags.slice(0, 5) : [];

    return prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          title: title.trim(),
          content: content.trim(),
          imageUrl: finalImageUrl,
          tags: finalTags,
          authorId,
        },
        select: { id: true, authorId: true },
      });

      // If FeedItem fanout exists in the Prisma client, we can fanout.
      // Otherwise, fall back to current behavior.
      const anyTx: any = tx as any;
      if (typeof anyTx.feedItem?.createMany === 'function') {
        // basic fanout to followers + self
        const followers: Array<{ followerId: string }> = await anyTx.follow.findMany({
          where: { followingId: authorId },
          select: { followerId: true },
        });
        const followerIds = followers.map((f) => f.followerId);
        if (!followerIds.includes(authorId)) followerIds.push(authorId);

        const postRow = await anyTx.post.findUnique({
          where: { id: post.id },
          select: {
            createdAt: true,
            likesCount: true,
            commentsCount: true,
            sharesCount: true,
            viewsCount: true,
            tags: true,
          },
        });

        const ageHours =
          (Date.now() - (postRow?.createdAt?.getTime?.() ?? Date.now())) / 3600000;
        const decay = Math.pow(ageHours + 2, 1.5);
        const engagementScore =
          ((postRow?.likesCount ?? 0) * 2 + (postRow?.commentsCount ?? 0) * 5 +
            (postRow?.viewsCount ?? 0) * 0.1 + (postRow?.sharesCount ?? 0) * 10) /
          (decay || 1);

        await anyTx.feedItem.createMany({
          data: followerIds.map((uid: string) => ({
            userId: uid,
            postId: post.id,
            score: engagementScore,
          })),
          skipDuplicates: true,
        });

        // tech fanout
        const tags = postRow?.tags ?? [];
        if (tags.length) {
          const techFollows: Array<{ userId: string }> = await anyTx.userTechnologyFollow.findMany({
            where: { technology: { in: tags } },
            select: { userId: true },
            distinct: ['userId'],
          });
          const techUserIds = techFollows.map((t) => t.userId);
          if (techUserIds.length) {
            await anyTx.technologyFeedItem.createMany({
              data: techUserIds.map((uid: string) => ({
                userId: uid,
                postId: post.id,
                technology: tags[0],
                score: engagementScore,
              })),
              skipDuplicates: true,
            });
          }
        }
      }

      // keep current response behavior (existing frontend expects post with author/likes/comments)
      return prisma.post.findUnique({
        where: { id: post.id },
        include: {
          author: true,
          likes: true,
          comments: {
            include: { author: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
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
  
  static async uploadImage(userId: string, data: string) {
    // In production, this would upload to cloud storage (Cloudinary, S3, etc.)
    // For now, we accept base64 data URLs and return them directly
    // Validate the data is a valid base64 image
    if (!data.startsWith('data:image/')) {
      throw new Error('Only image data URLs are supported')
    }
    
    // Return the data URL directly (in production, upload and return cloud URL)
    return { imageUrl: data }
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