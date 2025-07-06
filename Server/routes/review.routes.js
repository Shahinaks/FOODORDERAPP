import express from 'express';
import {
  createReview,
  getReviewsByMenuItem,
  getAllReviews,
  deleteReview,
} from '../controllers/review.controller.js';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.middleware.js';
const router = express.Router();
router.post('/', verifyFirebaseToken, createReview);
router.get('/', getAllReviews); 
router.get('/menu/:menuItemId', getReviewsByMenuItem); 
router.delete('/:id', verifyFirebaseToken, isAdmin, deleteReview);


export default router;
