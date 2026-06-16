import { Router } from 'express';
import { TechnologiesController } from './technologies.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, TechnologiesController.getAllTechnologies);
router.get('/trending', authenticate, TechnologiesController.getTrendingTechnologies);
router.get('/followed', authenticate, TechnologiesController.getFollowedTechnologies);
router.get('/:technology', authenticate, TechnologiesController.getTechnologyPage);
router.post('/:technology/follow', authenticate, TechnologiesController.followTechnology);
router.delete('/:technology/follow', authenticate, TechnologiesController.unfollowTechnology);

export default router;