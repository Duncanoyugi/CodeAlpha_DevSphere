import prisma from '../../config/database';

export class SearchService {
  static async searchGlobal(query: string, options?: {
    type?: 'all' | 'posts' | 'users' | 'tags';
    limit?: number;
  }) {
    const limit = options?.limit || 20;
    const type = options?.type || 'all';
    
    const results: any = {};
    
    if (type === 'all' || type === 'users') {
      results.users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { bio: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          username: true,
          avatar: true,
          bio: true,
          reputation: true
        },
        take: limit
      });
    }
    
    if (type === 'all' || type === 'posts') {
      results.posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } }
          ]
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          },
          _count: {
            select: { likes: true, comments: true }
          }
        },
        orderBy: [
          { likes: { _count: 'desc' } },
          { createdAt: 'desc' }
        ],
        take: limit
      });
    }
    
    if (type === 'all' || type === 'tags') {
      // Get unique tags from posts
      const allTags = await prisma.post.findMany({
        select: { tags: true }
      });
      
      const tagSet = new Set<string>();
      allTags.forEach(post => {
        post.tags.forEach(tag => {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            tagSet.add(tag);
          }
        });
      });
      
      results.tags = Array.from(tagSet).slice(0, limit);
    }
    
    // Log search for analytics is skipped here because req isn't available in this method signature.
    // If needed, update this method signature to accept the request.
    
    
    return results;
  }
  
  static async searchByTechnology(technology: string) {
    const [posts, users] = await Promise.all([
      prisma.post.findMany({
        where: { tags: { has: technology } },
        include: { author: true },
        take: 20
      }),
      prisma.userSkill.findMany({
        where: { skill: technology },
        include: { user: true },
        take: 20
      })
    ]);
    
    return {
      technology,
      posts,
      experts: users.map(u => u.user)
    };
  }
}