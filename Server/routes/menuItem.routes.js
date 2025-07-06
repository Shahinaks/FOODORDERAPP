import express from 'express';
import {
  createMenuItem,
  getAllMenuItems,
  getMenuItemsByRestaurant,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuItem.controller.js';

import { verifyFirebaseToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);
router.get('/by-restaurant/:restaurantId', getMenuItemsByRestaurant);

router.post('/', verifyFirebaseToken, isAdmin, createMenuItem);
router.put('/:id', verifyFirebaseToken, isAdmin, updateMenuItem);
router.delete('/:id', verifyFirebaseToken, isAdmin, deleteMenuItem);

export default router;
