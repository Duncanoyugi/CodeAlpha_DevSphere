import { Queue, Worker } from 'bullmq';
import redis from '../../config/redis';
import prisma from '../../config/database';

const isRedisEnabled = process.env.REDIS_ENABLED !== 'false';

// ---- Queues / Workers (guarded) ----
// When Redis is disabled, we export no-op queues/workers to avoid connection attempts.
const noopConnection = undefined as unknown as any;

export const notificationQueue = isRedisEnabled && redis
  ? new Queue('notifications', { connection: redis as unknown as any })
  : ({ add: async () => undefined } as any);


export const __bullmqRedisConnection = isRedisEnabled && redis ? (redis as unknown as any) : noopConnection;
export const feedGenerationQueue = isRedisEnabled && redis
  ? new Queue('feed-generation', { connection: redis as unknown as any })
  : ({ add: async () => undefined } as any);

export const emailQueue = isRedisEnabled && redis
  ? new Queue('emails', { connection: redis as unknown as any })
  : ({ add: async () => undefined } as any);

export const mediaProcessingQueue = isRedisEnabled && redis
  ? new Queue('media-processing', { connection: redis as unknown as any })
  : ({ add: async () => undefined } as any);


// Worker: Process notifications
// Note: BullMQ connection typing can conflict with ioredis versions; use any to keep tsc compiling.
export const notificationWorker = isRedisEnabled && redis
  ? new Worker(
      'notifications',
      async (job) => {

        const { userId, type, actorId, actorName, postId } = job.data;

        const notification = await prisma.notification.create({
          data: {
            userId,
            type,
            actorId,
            actorName,
            postId,
            createdAt: new Date()
          }
        });

        // Emit via Socket.io
        const { getIO } = require('../config/socket');
        const io = getIO();
        io.to(`user:${userId}`).emit('new_notification', notification);

        return notification;
      },
      { connection: redis as any }
    )
  : ({} as any);

// Worker: Process feed generation for user
export const feedGenerationWorker = isRedisEnabled && redis
  ? new Worker(
      'feed-generation',
      async (job) => {

        const { userId, limit } = job.data;

        // This would generate a personalized feed and cache it in Redis
        const feed = await generatePersonalizedFeed(userId, limit);

        await (redis as any).set(`user:${userId}:feed`, JSON.stringify(feed), 'EX', 300); // Cache for 5 minutes

        return feed;
      },
      { connection: redis as any }
    )
  : ({} as any);

// Worker: Process media (images, videos)
export const mediaProcessingWorker = isRedisEnabled && redis
  ? new Worker(
      'media-processing',
      async (job) => {

        const { mediaUrl, type, postId } = job.data;

        // This would:
        // 1. Download the media
        // 2. Generate thumbnails
        // 3. Optimize for web
        // 4. Store optimized versions
        // 5. Update post with processed URLs

        console.log(`Processing ${type} for post ${postId}: ${mediaUrl}`);

        // Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return { processed: true, thumbnailUrl: `${mediaUrl}/thumbnail` };
      },
      { connection: redis as any }
    )
  : ({} as any);

// Helper function for feed generation
async function generatePersonalizedFeed(userId: string, limit: number) {
  // Get user interests (followed technologies)
  const userFollowsTech = await prisma.userTechnologyFollow.findMany({
    where: { userId },
    select: { technology: true }
  });

  const interests = userFollowsTech.map((f: { technology: string }) => f.technology);

  // Get user skills
  const userSkills = await prisma.userSkill.findMany({
    where: { userId },
    select: { skill: true }
  });

  const skills = userSkills.map((s: { skill: string }) => s.skill);

  // Build personalized feed query
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { tags: { hasSome: interests } },
        { tags: { hasSome: skills } },
        { author: { followers: { some: { followerId: userId } } } }
      ]
    },
    include: {
      author: true,
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

  return posts;
}

export const initializeWorkers = async () => {
  if (!isRedisEnabled) {
    console.log('ℹ️ BullMQ workers disabled (Redis disabled)');
    return;
  }

  // Workers are created above when Redis is enabled; calling this ensures module is imported.
  void notificationWorker;
  void feedGenerationWorker;
  void mediaProcessingWorker;
  void emailWorker;
  console.log('✅ BullMQ workers initialized');
};

// Email worker
export const emailWorker = isRedisEnabled && redis
  ? new Worker(
      'emails',
      async (job) => {

        const { to, subject } = job.data;

        // This would send emails using nodemailer, SendGrid, etc.
        console.log(`Sending email to ${to}: ${subject}`);

        // Simulate email sending
        await new Promise((resolve) => setTimeout(resolve, 500));

        return { sent: true, to, subject };
      },
      { connection: redis as any }
    )
  : ({} as any);

