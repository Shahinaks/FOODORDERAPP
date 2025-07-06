import express from 'express';
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderById,
  filterOrdersByStatus,
  getOrderPaymentStatus 
} from '../controllers/order.controller.js';

import { verifyFirebaseToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', verifyFirebaseToken, placeOrder);                     
router.get('/my-orders', verifyFirebaseToken, getUserOrders);          
router.put('/:orderId/cancel', verifyFirebaseToken, cancelOrder);      
router.get('/:orderId', verifyFirebaseToken, getOrderById);            

router.get('/:orderId/payment-status', verifyFirebaseToken, getOrderPaymentStatus);

router.get('/filter/status', verifyFirebaseToken, isAdmin, filterOrdersByStatus); 
router.get('/', verifyFirebaseToken, isAdmin, getAllOrders);                     
router.put('/:orderId/status', verifyFirebaseToken, isAdmin, updateOrderStatus);  



export default router;
