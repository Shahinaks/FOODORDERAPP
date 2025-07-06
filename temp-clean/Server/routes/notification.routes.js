import express from 'express';
import {
  createNotification,
  deleteNotification,
  getAllNotifications,
} from '../controllers/notification.controller.js';

import { verifyFirebaseToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyFirebaseToken, getAllNotifications);

router.post('/', verifyFirebaseToken, isAdmin, createNotification);

router.delete('/:id', verifyFirebaseToken, isAdmin, deleteNotification);

export default router;
