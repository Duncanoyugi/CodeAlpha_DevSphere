import { Router } from 'express';
import { SearchController } from './search.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/global', authenticate, SearchController.globalSearch);
router.get('/technology/:technology', authenticate, SearchController.searchByTechnology);
router.get('/users/suggest', authenticate, SearchController.suggestUsers);
router.get('/tags/popular', authenticate, SearchController.getPopularTags);
router.post('/index/reindex', authenticate, SearchController.reindex);

export default router;