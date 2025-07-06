import express from 'express';
import { verifyFirebaseToken, isAdmin } from '../middleware/auth.middleware.js';
import Order from '../models/Order.model.js';
import { MenuItem } from '../models/MenuItem.model.js';
import User from '../models/User.model.js';

const router = express.Router();

router.get('/overview', verifyFirebaseToken, isAdmin, async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalMenuItems] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      MenuItem.countDocuments()
    ]);

    const totalRevenueAgg = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menuitems',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'menuItemDetails'
        }
      },
      { $unwind: '$menuItemDetails' },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $multiply: ['$items.quantity', '$menuItemDetails.price'] }
          }
        }
      }
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const orderStatusBreakdownAgg = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const orderStatusBreakdown = orderStatusBreakdownAgg.map(entry => ({
      name: entry._id || 'Unknown',
      value: entry.count
    }));

    res.status(200).json({
      totalOrders,
      totalRevenue,
      totalUsers,
      totalMenuItems,
      orderStatusBreakdown
    });

  } catch (err) {
    console.error('Overview fetch failed:', err);
    res.status(500).json({ message: 'Failed to fetch admin overview' });
  }
});

export default router;
