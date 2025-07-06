import express from 'express';
import { createPaymentIntent, storePayment ,getAllPayments } from '../controllers/payment.controller.js';
import { verifyFirebaseToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/intent', verifyFirebaseToken, createPaymentIntent);
router.post('/', verifyFirebaseToken, storePayment);
router.get('/all', verifyFirebaseToken, getAllPayments);

export default router;
