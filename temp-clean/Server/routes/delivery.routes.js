import express from 'express';
import { assignDelivery, getAllDeliveries,getDeliveryById,deleteDelivery,updateDeliveryStatus} from '../controllers/delivery.controller.js';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.middleware.js';
const router = express.Router();
router.get('/', verifyFirebaseToken, isAdmin, getAllDeliveries);
router.post('/', verifyFirebaseToken, isAdmin, assignDelivery);
router.get('/:id', verifyFirebaseToken, isAdmin, getDeliveryById);
router.delete('/:id', verifyFirebaseToken, isAdmin, deleteDelivery);
router.put('/:id/status', verifyFirebaseToken, isAdmin, updateDeliveryStatus);




export default router;
