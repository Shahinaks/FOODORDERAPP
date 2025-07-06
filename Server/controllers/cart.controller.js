import { Cart } from '../models/Cart.model.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    console.error('Error in getCart:', err);
    res.status(500).json({ message: 'Failed to load cart', error: err.message });
  }
};

export const addToCart = async (req, res) => {
  const { menuItemId, quantity } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.menuItem.toString() === menuItemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ menuItem: menuItemId, quantity });
    }

    await cart.save();
    await cart.populate('items.menuItem');

    res.status(200).json(cart);
  } catch (err) {
    console.error('Error in addToCart:', err);
    res.status(500).json({ message: 'Failed to add item to cart', error: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  const { menuItemId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(i => i.menuItem.toString() === menuItemId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1); 
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.menuItem');

    res.json(cart);
  } catch (err) {
    console.error('Error in updateCartItem:', err);
    res.status(500).json({ message: 'Failed to update cart item', error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { menuItemId } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.menuItem.toString() !== menuItemId);

    await cart.save();
    await cart.populate('items.menuItem');

    res.json(cart);
  } catch (err) {
    console.error('Error in removeFromCart:', err);
    res.status(500).json({ message: 'Failed to remove item', error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Error in clearCart:', err);
    res.status(500).json({ message: 'Failed to clear cart', error: err.message });
  }
};
