import prisma from '../../config/database';
import redis from '../../config/redis';

const redisClient = redis;

export enum ReputationAction {
  CREATE_POST = 'CREATE_POST',
  RECEIVE_LIKE = 'RECEIVE_LIKE',
  RECEIVE_COMMENT = 'RECEIVE_COMMENT',
  POST_ANSWER_ACCEPTED = 'POST_ANSWER_ACCEPTED',
  QUESTION_UPVOTED = 'QUESTION_UPVOTED',
  ANSWER_UPVOTED = 'ANSWER_UPVOTED',
  FOLLOWED = 'FOLLOWED',
  REPORTED = 'REPORTED'
}

export const ReputationPoints = {
  [ReputationAction.CREATE_POST]: 10,
  [ReputationAction.RECEIVE_LIKE]: 2,
  [ReputationAction.RECEIVE_COMMENT]: 3,
  [ReputationAction.POST_ANSWER_ACCEPTED]: 50,
  [ReputationAction.QUESTION_UPVOTED]: 5,
  [ReputationAction.ANSWER_UPVOTED]: 10,
  [ReputationAction.FOLLOWED]: 1,
  [ReputationAction.REPORTED]: -10
};

export const ReputationLevels = [
  { name: 'New Developer', threshold: 0, color: '#gray' },
  { name: 'Learning Contributor', threshold: 100, color: '#bronze' },
  { name: 'Active Developer', threshold: 500, color: '#silver' },
  { name: 'Senior Contributor', threshold: 2000, color: '#gold' },
  { name: 'Tech Expert', threshold: 5000, color: '#platinum' },
  { name: 'Community Legend', threshold: 10000, color: '#diamond' }
];

export class ReputationService {
  static async addReputation(userId: string, action: ReputationAction, metadata?: any) {
    const points = ReputationPoints[action];
    
    // Update user's reputation in database
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        reputation: {
          increment: points
        }
      }
    });
    
    // Store in Redis for quick access
    if (redis) {
      await redis.set(`user:${userId}:reputation`, user.reputation);
    }
    
    // Check if user leveled up
    const currentLevel = this.getReputationLevel(user.reputation - points);
    const newLevel = this.getReputationLevel(user.reputation);
    
    if (currentLevel.name !== newLevel.name) {
      // Award badge for new level
      await this.awardBadge(userId, newLevel.name);
    }
    
    // Create reputation transaction record
    await prisma.reputationTransaction.create({
      data: {
        userId,
        action,
        points,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    });
    
    return { reputation: user.reputation, level: newLevel, leveledUp: currentLevel.name !== newLevel.name };
  }
  
  static async removeReputation(userId: string, action: ReputationAction) {
    const points = -ReputationPoints[action];
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        reputation: {
          decrement: ReputationPoints[action]
        }
      }
    });
    
    if (redis) {
      await redis.set(`user:${userId}:reputation`, user.reputation);
    }
    
    return { reputation: user.reputation };
  }
  
  static getReputationLevel(reputation: number) {
    for (let i = ReputationLevels.length - 1; i >= 0; i--) {
      if (reputation >= ReputationLevels[i].threshold) {
        return ReputationLevels[i];
      }
    }
    return ReputationLevels[0];
  }
  
  static async awardBadge(userId: string, badgeName: string) {
    const existingBadge = await prisma.badge.findFirst({
      where: {
        userId,
        name: badgeName
      }
    });
    
    if (!existingBadge) {
      await prisma.badge.create({
        data: {
          userId,
          name: badgeName,
          awardedAt: new Date()
        }
      });
    }
  }
  
  static async getUserBadges(userId: string) {
    return prisma.badge.findMany({
      where: { userId },
      orderBy: { awardedAt: 'desc' }
    });
  }
  
  static async getLeaderboard(limit: number = 50) {
    // Try cache first
    const cached = await (redis ? redis.get('reputation:leaderboard') : Promise.resolve(null));
    if (cached) {
      return JSON.parse(cached);
    }
    
    const leaders = await prisma.user.findMany({
      where: {
        reputation: { gt: 0 }
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        reputation: true
      },
      orderBy: {
        reputation: 'desc'
      },
      take: limit
    });
    
    // Cache for 1 hour (if Redis enabled)
    if (redis) {
      await redis.set('reputation:leaderboard', JSON.stringify(leaders), 'EX', 3600);
    }
    
    return leaders;
  }
}