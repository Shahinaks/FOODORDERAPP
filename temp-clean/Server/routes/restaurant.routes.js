import express from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurant.controller.js';

import { verifyFirebaseToken,isAdmin } from '../middleware/auth.middleware.js';


const router = express.Router();
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', verifyFirebaseToken, isAdmin, createRestaurant);
router.put('/:id', verifyFirebaseToken, isAdmin, updateRestaurant);
router.delete('/:id', verifyFirebaseToken, isAdmin, deleteRestaurant);
export default router;
