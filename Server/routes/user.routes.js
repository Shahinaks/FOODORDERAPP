import express from 'express';

import { verifyFirebaseToken, isAdmin } from '../middleware/auth.middleware.js';


import {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  checkUser, 
} from '../controllers/user.controller.js';

const router = express.Router();
router.get('/profile', verifyFirebaseToken, getProfile);
router.put('/profile', verifyFirebaseToken, updateProfile);
router.get('/check', verifyFirebaseToken, checkUser);
router.get('/users', verifyFirebaseToken, isAdmin, getAllUsers);
router.delete('/users/:id', verifyFirebaseToken, isAdmin, deleteUser);
export default router;
