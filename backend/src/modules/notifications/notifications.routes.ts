import { Router } from 'express';
import { NotificationsController } from './notifications.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/', authenticate, NotificationsController.getNotifications);
router.patch('/:id/read', authenticate, NotificationsController.markAsRead);
router.patch('/read-all', authenticate, NotificationsController.markAllAsRead);
router.get('/unread/count', authenticate, NotificationsController.getUnreadCount);

export default router;