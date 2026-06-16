import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/track', authenticate, AnalyticsController.track);
router.get('/user/stats', authenticate, AnalyticsController.getUserStats);
router.get('/platform', authenticate, AnalyticsController.getPlatformStats);
router.get('/post/:postId', authenticate, AnalyticsController.getPostAnalytics);

export default router;