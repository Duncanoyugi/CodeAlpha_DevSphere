import { Router } from 'express';
import { RepostsController } from './reposts.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/:postId', authenticate, RepostsController.toggleRepost);
router.get('/:postId', RepostsController.getPostReposts);

export default router;
