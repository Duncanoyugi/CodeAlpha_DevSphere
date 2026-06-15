import { Router } from 'express';
import { FollowsController } from './follows.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/:userId', authenticate, FollowsController.followUser);
router.delete('/:userId', authenticate, FollowsController.unfollowUser);
router.get('/followers/:userId', authenticate, FollowsController.getFollowers);
router.get('/following/:userId', authenticate, FollowsController.getFollowing);
router.get('/check/:userId', authenticate, FollowsController.isFollowing);
router.get('/counts/:userId', authenticate, FollowsController.getFollowCounts);

export default router;