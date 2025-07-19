
import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cart.controller.js';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';

const router = express.Router();


router.get('/all', verifyFirebaseToken, async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
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

// Secure all user routes with token middleware
router.use(verifyFirebaseToken);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove', removeFromCart);
router.delete('/clear', clearCart);

export default router;
