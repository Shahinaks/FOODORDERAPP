// controllers/wishlist.controller.js
import Wishlist from '../models/Wishlist.model.js';

export const addToWishlist = async (req, res) => {
  const { menuItemId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [menuItemId] });
    } else {
      if (!wishlist.items.includes(menuItemId)) {
        wishlist.items.push(menuItemId);
      }
    }

    await wishlist.save();
    const populated = await wishlist.populate('items');
    res.json(populated);
  } catch (err) {
    console.error('❌ Error adding to wishlist:', err);
    res.status(500).json({ message: 'Failed to update wishlist' });
  }
};

export const getWishlist = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items');
    if (!wishlist) return res.json({ items: [] });

    res.json(wishlist);
  } catch (err) {
    console.error('❌ Error fetching wishlist:', err);
    res.status(500).json({ message: 'Server error while fetching wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { menuItemId } = req.params;
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.items = wishlist.items.filter(item => item.toString() !== menuItemId);
    await wishlist.save();
    const populated = await wishlist.populate('items');
    res.json({ message: 'Item removed', wishlist: populated });
  } catch (err) {
    console.error('❌ Error removing from wishlist:', err);
    res.status(500).json({ message: 'Failed to remove item' });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.items = [];
    await wishlist.save();
    res.json({ message: 'Wishlist cleared', wishlist });
  } catch (err) {
    console.error('❌ Error clearing wishlist:', err);
    res.status(500).json({ message: 'Failed to clear wishlist' });
  }
};
