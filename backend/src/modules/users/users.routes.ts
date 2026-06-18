import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/profile/:id?', authenticate, UsersController.getProfile);
router.get('/username/:username', authenticate, UsersController.getProfileByUsername);
router.patch('/profile', authenticate, UsersController.updateProfile);
router.post('/skills', authenticate, UsersController.addSkill);
router.patch('/skills/:skillId', authenticate, UsersController.updateSkill);
router.delete('/skills/:skillId', authenticate, UsersController.removeSkill);
router.get('/search', authenticate, UsersController.searchUsers);
router.get('/', authenticate, UsersController.getUsers);

export default router;