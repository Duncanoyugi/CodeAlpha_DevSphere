import { Router } from 'express';
import { ReputationController } from './reputation.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/me', authenticate, ReputationController.getMyReputation);
router.get('/user/:userId', authenticate, ReputationController.getUserReputation);
router.get('/badges', authenticate, ReputationController.getMyBadges);
router.get('/badges/:userId', authenticate, ReputationController.getUserBadges);
router.get('/leaderboard', authenticate, ReputationController.getLeaderboard);
router.get('/transactions', authenticate, ReputationController.getMyTransactions);
router.post('/calculate/:postId', authenticate, ReputationController.calculatePostReputation);

export default router;