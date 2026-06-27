import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../../middleware/auth';
import { upload } from '../../middleware/upload';

const router = Router();

router.get('/profile/:id?', authenticate, UsersController.getProfile);
router.get('/username/:username', authenticate, UsersController.getProfileByUsername);
router.patch('/profile', authenticate, UsersController.updateProfile);
router.post('/avatar/upload', authenticate, upload.single('file'), (error: any, _req: any, res: any, next: (error?: any) => void) => {
  if (error) {
    return res.status(400).json({ message: error.message || 'Upload failed' });
  }
  next();
}, UsersController.uploadAvatar);
router.post('/skills', authenticate, UsersController.addSkill);
router.get('/skills/:userId?', authenticate, UsersController.getSkills);
router.patch('/skills/:skillId', authenticate, UsersController.updateSkill);
router.delete('/skills/:skillId', authenticate, UsersController.removeSkill);
router.get('/search', authenticate, UsersController.searchUsers);
router.get('/', authenticate, UsersController.getUsers);

export default router;