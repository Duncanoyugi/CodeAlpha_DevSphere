import prisma from '../../config/database';

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
  }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      include: { skills: true }
    });
    
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  static async addSkill(userId: string, skill: string, level: string) {
    return prisma.userSkill.create({
      data: {
        userId,
        skill,
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
        experience: true
      },
      take: 20
    });
  }
}