import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const isRedisEnabled = process.env.REDIS_ENABLED !== 'false';

const redis = isRedisEnabled
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      retryStrategy(times) {
        if (times > 3) {
          console.log('Redis unavailable. Stopping retries.');
          return null;
        }
        return Math.min(times * 500, 3000);
      },
    })
  : null;

if (redis) {
  redis.on('connect', () => {
    console.log('✅ Redis connected');
  });

  redis.on('error', (error) => {
    console.log('Redis error:', error.message);
  });
}

export const initializeRedis = async () => {
  if (!redis) {
    console.log('ℹ️ Redis disabled (REDIS_ENABLED=false)');
    return;
  }

  try {
    await redis.ping();
    console.log('✅ Redis ping successful');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
  }
};

export default redis;
