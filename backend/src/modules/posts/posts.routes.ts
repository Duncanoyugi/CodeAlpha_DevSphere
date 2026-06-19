import { Router } from 'express';
import { PostsController } from './posts.controller';
import { authenticate } from '../../middleware/auth';
import { upload } from '../../middleware/upload';

const router = Router();

router.post('/', authenticate, PostsController.createPost);
router.post('/upload', authenticate, upload.single('file'), (error: any, _req: any, res: any, next: (error?: any) => void) => {
  if (error) {
    return res.status(400).json({ message: error.message || 'Upload failed' });
  }
  next();
}, PostsController.uploadImage);
router.get('/:id', authenticate, PostsController.getPost);
router.patch('/:id', authenticate, PostsController.updatePost);
router.delete('/:id', authenticate, PostsController.deletePost);
router.get('/user/:userId', authenticate, PostsController.getUserPosts);
router.get('/tag/:tag', authenticate, PostsController.getPostsByTag);

export default router;