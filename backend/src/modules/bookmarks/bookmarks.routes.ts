import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { BookmarksController } from './bookmarks.controller';

const router = Router();

// POST /api/posts/:id/bookmark
router.post('/posts/:id/bookmark', authenticate, BookmarksController.toggleBookmark);
router.delete('/posts/:id/bookmark', authenticate, BookmarksController.toggleBookmark);

// GET /api/profile/bookmarks
router.get('/profile/bookmarks', authenticate, BookmarksController.getBookmarks);

export default router;

