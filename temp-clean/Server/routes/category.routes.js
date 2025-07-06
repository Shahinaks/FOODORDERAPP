import express from 'express';
import { createCategory, getAllCategories,getCategoryById,deleteCategory } from '../controllers/category.controller.js';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.middleware.js';
const router = express.Router();
router.post('/', verifyFirebaseToken, isAdmin, createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.delete('/:id', verifyFirebaseToken, isAdmin, deleteCategory);

export default router;
