import { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

export const rateLimit = (config: RateLimitConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).userId || req.ip;
    const key = `rate-limit:${userId}:${req.path}`;
    
    // If Redis is disabled, skip rate limiting entirely
    if (!redis) {
      return next();
    }

    const current = await redis.get(key);
    const currentCount = current ? parseInt(current) : 0;

    if (currentCount >= config.maxRequests) {
      return res.status(429).json({
        message: config.message || 'Too many requests, please try again later.',
        retryAfter: Math.ceil(config.windowMs / 1000)
      });
    }
    
    if (currentCount === 0) {
      await redis.set(key, '1', 'PX', config.windowMs);
    } else {
      await redis.incr(key);
    }
    
    next();
  };
};

// Specific rate limiters
export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  message: 'Too many requests. Please slow down.'
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many authentication attempts. Please try again later.'
});

export const postRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 3,
  message: 'Please wait before creating more posts.'
});
