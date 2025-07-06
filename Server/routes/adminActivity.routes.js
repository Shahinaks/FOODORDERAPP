import express from 'express';
import { getAllActivities } from '../controllers/adminActivity.controller.js';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyFirebaseToken, isAdmin, getAllActivities);

export default router;
