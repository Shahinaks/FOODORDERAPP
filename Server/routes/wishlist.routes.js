import express from 'express';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist
} from '../controllers/wishlist.controller.js';
import { verifyFirebaseToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', verifyFirebaseToken, addToWishlist);
router.get('/', verifyFirebaseToken, getWishlist);
router.delete('/', verifyFirebaseToken, clearWishlist);             
router.delete('/:menuItemId', verifyFirebaseToken, removeFromWishlist);

export default router;
