import prisma from '../../config/database';

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

export class UsersService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          include: {
            likes: true,
            comments: {
              include: { author: true }
            },
            author: true
          }
        },
        followers: {
          include: { follower: true }
        },
        following: {
          include: { following: true }
        }
      }
    });
    
    if (!user) throw new Error('User not found');
    
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  static async getProfileByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        skills: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          include: {
            likes: true,
            comments: {
              include: { author: true }
            },
            author: true
          }
        },
        followers: true,
        following: true
      }
    });
    
    if (!user) throw new Error('User not found');
    
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  static async updateProfile(userId: string, data: {
    bio?: string;
    experience?: string;
    avatar?: string;
    githubUrl?: string;
    linkedInUrl?: string;
    portfolioUrl?: string;
  }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        githubUrl: normalizeOptionalUrl(data.githubUrl),
        linkedInUrl: normalizeOptionalUrl(data.linkedInUrl),
        portfolioUrl: normalizeOptionalUrl(data.portfolioUrl),
      },
      include: { skills: true }
    });
    
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  static async getSkills(userId: string) {
    return prisma.userSkill.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }
  
  static async addSkill(userId: string, skill: string, level: string) {
    const normalizedSkill = skill.trim();
    if (!normalizedSkill) throw new Error('Skill is required');
    
    return prisma.userSkill.create({
      data: {
        userId,
        skill: normalizedSkill,
        level
      }
    });
  }
  
  static async updateSkill(userId: string, skillId: string, level: string) {
    const skill = await prisma.userSkill.findFirst({
      where: {
        id: skillId,
        userId
      }
    });
    
    if (!skill) throw new Error('Skill not found');
    
    return prisma.userSkill.update({
      where: { id: skillId },
      data: { level }
    });
  }
  
  static async removeSkill(userId: string, skillId: string) {
    const skill = await prisma.userSkill.findFirst({
      where: {
        id: skillId,
        userId
      }
    });
    
    if (!skill) throw new Error('Skill not found');
    
    return prisma.userSkill.delete({
      where: { id: skillId }
    });
  }
  
  static async searchUsers(query: string) {
    return prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
        experience: true,
      },
      take: 20
    });
  }

  static async getUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
        experience: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async uploadAvatar(userId: string, data: string) {
    if (!data.startsWith('data:image/')) {
      throw new Error('Only image data URLs are supported');
    }

    const base64Data = data.split(',')[1] || '';
    const size = Buffer.byteLength(base64Data, 'base64');
    const maxSize = 5 * 1024 * 1024;
    if (size > maxSize) {
      throw new Error('Image is too large. Please use an image under 5MB.');
    }

    return {
      avatarUrl: data,
    };
  }
}
