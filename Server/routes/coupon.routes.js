import express from 'express';
import {
  createCoupon,
  getAvailableCoupons,
  getAllCoupons,
  deleteCoupon,
  applyCoupon
} from '../controllers/coupon.controller.js';

import { verifyFirebaseToken, isAdmin } from '../middleware/auth.middleware.js';
const router = express.Router();
router.post('/', verifyFirebaseToken, isAdmin, createCoupon);
router.get('/available', verifyFirebaseToken, getAvailableCoupons);
router.get('/', verifyFirebaseToken, isAdmin, getAllCoupons);
router.delete('/:id', verifyFirebaseToken, isAdmin, deleteCoupon);
router.post('/apply', verifyFirebaseToken, applyCoupon);

export default router;
