import { Router } from 'express';
import { LikesController } from './likes.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/:postId', authenticate, LikesController.likePost);
router.delete('/:postId', authenticate, LikesController.unlikePost);
router.get('/:postId', authenticate, LikesController.getPostLikes);
router.get('/check/:postId', authenticate, LikesController.hasLiked);

export default router;