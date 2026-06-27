import fs from 'fs';
import path from 'path';
import prisma from '../../config/database';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024;

const allowedMediaTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
]);

function normalizeOptionalUrl(value?: string) {
  if (!value || !value.trim()) return undefined;
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Unsupported URL protocol');
    }
    return url.toString();
  } catch {
    throw new Error(`${value} must be a valid http(s) URL`);
  }
}

function normalizeTags(tags?: unknown) {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => typeof tag === 'string' ? tag.trim().replace(/^#/, '') : '')
    .filter((tag, index, all) => tag && all.indexOf(tag) === index)
    .slice(0, 5);
}

function validateMedia(mediaType?: string, mediaSize?: number) {
  if (!mediaType) return;
  if (!allowedMediaTypes.has(mediaType)) {
    throw new Error('Unsupported media type');
  }

  const limit = mediaType.startsWith('image/')
    ? MAX_IMAGE_BYTES
    : mediaType.startsWith('video/')
      ? MAX_VIDEO_BYTES
      : MAX_DOCUMENT_BYTES;

  if (mediaSize && mediaSize > limit) {
    throw new Error(`Media is too large. Limit is ${Math.floor(limit / 1024 / 1024)}MB.`);
  }
}

function normalizeOptionalMediaUrl(value?: string) {
  if (!value || value.startsWith('data:')) return value;
  if (!value.startsWith('/uploads/')) {
    throw new Error('Invalid media URL');
  }
  return `/uploads/${path.basename(value)}`;
}

export class PostsService {
  static async createPost(authorId: string, data: {
    title: string;
    content: string;
    imageUrl?: string;
    mediaUrl?: string;
    mediaType?: string;
    mediaSize?: number;
    githubRepoUrl?: string;
    liveDemoUrl?: string;
    tags?: string[];
    [key: string]: any;
  }) {
    const { title, content, imageUrl, mediaUrl, mediaType, mediaSize, githubRepoUrl, liveDemoUrl, tags } = data;

    if (!title || !title.trim()) {
      throw new Error('Title is required');
    }
    if (!content || !content.trim()) {
      throw new Error('Content is required');
    }

    const finalImageUrl = typeof imageUrl === 'string' && imageUrl.startsWith('data:image/')
      ? imageUrl
      : undefined;

    if (finalImageUrl) {
      const base64Data = finalImageUrl.split(',')[1] || '';
      const size = Buffer.byteLength(base64Data, 'base64');
      if (size > MAX_IMAGE_BYTES) {
        throw new Error('Image is too large. Please use an image under 5MB.');
      }
    }

    const finalTags = normalizeTags(tags);
    const normalizedGithubRepoUrl = normalizeOptionalUrl(githubRepoUrl);
    const normalizedLiveDemoUrl = normalizeOptionalUrl(liveDemoUrl);
    validateMedia(mediaType, mediaSize);

    return prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          title: title.trim(),
          content: content.trim(),
          imageUrl: finalImageUrl,
          mediaUrl: normalizeOptionalMediaUrl(mediaUrl),
          mediaType,
          mediaSize,
          githubRepoUrl: normalizedGithubRepoUrl,
          liveDemoUrl: normalizedLiveDemoUrl,
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
          reposts: {
            include: {
              user: {
                select: { id: true, username: true, avatar: true },
              },
            },
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
        bookmarks: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'desc' }
        },
        reposts: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
          },
        },
      }
    });
    
    if (!post) throw new Error('Post not found');
    return post;
  }
  
  static async updatePost(postId: string, userId: string, data: {
    title?: string;
    content?: string;
    imageUrl?: string;
    mediaUrl?: string;
    mediaType?: string;
    mediaSize?: number;
    githubRepoUrl?: string;
    liveDemoUrl?: string;
    tags?: string[];
  }) {
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) throw new Error('Post not found');
    if (post.authorId !== userId) throw new Error('Unauthorized');
    
    const updateData: any = {};
    if (data.title !== undefined) {
      if (!data.title.trim()) throw new Error('Title is required');
      updateData.title = data.title.trim();
    }
    if (data.content !== undefined) {
      if (!data.content.trim()) throw new Error('Content is required');
      updateData.content = data.content.trim();
    }
    if (data.imageUrl !== undefined) {
      updateData.imageUrl = typeof data.imageUrl === 'string' && data.imageUrl.startsWith('data:image/') ? data.imageUrl : undefined;
    }
    if (data.githubRepoUrl !== undefined) updateData.githubRepoUrl = normalizeOptionalUrl(data.githubRepoUrl);
    if (data.liveDemoUrl !== undefined) updateData.liveDemoUrl = normalizeOptionalUrl(data.liveDemoUrl);
    if (data.tags !== undefined) updateData.tags = normalizeTags(data.tags);
    if (data.mediaUrl !== undefined) updateData.mediaUrl = normalizeOptionalMediaUrl(data.mediaUrl);
    if (data.mediaType !== undefined) updateData.mediaType = data.mediaType;
    if (data.mediaSize !== undefined) updateData.mediaSize = data.mediaSize;
    validateMedia(updateData.mediaType ?? post.mediaType, updateData.mediaSize ?? post.mediaSize);
    
    return prisma.post.update({
      where: { id: postId },
      data: updateData,
      include: {
        author: true,
        likes: true,
        bookmarks: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'desc' },
        },
        reposts: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
          },
        },
      }
    });
  }
  
  static async deletePost(postId: string, userId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) throw new Error('Post not found');
    if (post.authorId !== userId) throw new Error('Unauthorized');
    
    await PostsService.deleteMediaFile(post.mediaUrl || undefined);
    
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
        bookmarks: true,
        comments: {
          include: { author: true }
        },
        reposts: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
          },
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
  
  static async uploadImage(userId: string, data: string) {
    if (!data.startsWith('data:image/')) {
      throw new Error('Only image data URLs are supported')
    }
    
    const base64Data = data.split(',')[1] || '';
    const size = Buffer.byteLength(base64Data, 'base64');
    if (size > MAX_IMAGE_BYTES) {
      throw new Error('Image is too large. Please use an image under 5MB.');
    }
    
    return {
      imageUrl: data,
      mediaUrl: data,
      mediaType: data.match(/^data:([^;]+)/)?.[1] || 'image',
      mediaSize: size,
    }
  }

  static async deleteMediaFile(mediaUrl?: string) {
    if (!mediaUrl || mediaUrl.startsWith('data:')) return;
    const uploadPath = path.join(process.cwd(), 'uploads', 'public', path.basename(mediaUrl));
    try {
      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath);
      }
    } catch {
      // Ignore cleanup failures so post deletion still succeeds.
    }
  }

  static async getPostsByTag(tag: string) {
    return prisma.post.findMany({
      where: {
        tags: { has: tag }
      },
      include: {
        author: true,
        likes: true,
        bookmarks: true,
        comments: {
          include: { author: true },
          take: 5
        },
        reposts: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
          },
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}