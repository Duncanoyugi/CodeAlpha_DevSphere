import prisma from '../../config/database';

export class FollowsService {
  static async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }
    
    const user = await prisma.user.findUnique({
      where: { id: followingId }
    });
    
    if (!user) throw new Error('User not found');
    
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });
    
    if (existing) throw new Error('Already following');
    
    return prisma.follow.create({
      data: {
        followerId,
        followingId
      },
      include: {
        following: true,
        follower: true
      }
    });
  }
  
  static async unfollowUser(followerId: string, followingId: string) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });
    
    if (!follow) throw new Error('Not following');
    
    return prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });
  }
  
  static async getFollowers(userId: string) {
    return prisma.follow.findMany({
      where: { followingId: userId },
      include: { follower: true }
    });
  }
  
  static async getFollowing(userId: string) {
    return prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: true }
    });
  }
  
  static async isFollowing(followerId: string, followingId: string) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    });
    return !!follow;
  }
  
  static async getFollowCounts(userId: string) {
    const [followers, following] = await Promise.all([
      prisma.follow.count({ where: { followingId: userId } }),
      prisma.follow.count({ where: { followerId: userId } })
    ]);
    
    return { followers, following };
  }
}