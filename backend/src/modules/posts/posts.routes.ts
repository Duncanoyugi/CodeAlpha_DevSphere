import { Router } from 'express';
import { PostsController } from './posts.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, PostsController.createPost);
router.post('/upload', authenticate, PostsController.uploadImage);
router.get('/:id', authenticate, PostsController.getPost);
router.patch('/:id', authenticate, PostsController.updatePost);
router.delete('/:id', authenticate, PostsController.deletePost);
router.get('/user/:userId', authenticate, PostsController.getUserPosts);
router.get('/tag/:tag', authenticate, PostsController.getPostsByTag);

export default router;