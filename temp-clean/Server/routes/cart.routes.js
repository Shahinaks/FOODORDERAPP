import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cart.controller.js';

import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';
import { Cart } from '../models/Cart.model.js';

const router = express.Router();

router.get('/all', verifyFirebaseToken, async (req, res) => {
  if (req.user?.admin !== true) {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const carts = await Cart.find()
      .populate('user', 'name email')
      .populate('items.menuItem');
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch carts', error: err.message });
  }
});

router.use(verifyFirebaseToken);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove', removeFromCart);
router.delete('/clear', clearCart);

export default router;
