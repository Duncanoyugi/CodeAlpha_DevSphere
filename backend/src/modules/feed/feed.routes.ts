import { Router } from 'express';
import { FeedController } from './feed.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/home', authenticate, FeedController.getHomeFeed);
router.get('/trending', authenticate, FeedController.getTrendingFeed);
router.get('/developers', authenticate, FeedController.getDevelopersFeed);

export default router;