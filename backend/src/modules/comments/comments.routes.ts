import { Router } from 'express';
import { CommentsController } from './comments.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, CommentsController.createComment);
router.delete('/:id', authenticate, CommentsController.deleteComment);
router.get('/post/:postId', authenticate, CommentsController.getPostComments);

export default router;