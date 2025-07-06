import Order from '../models/Order.model.js';
import MenuItem from '../models/MenuItem.model.js';
import User from '../models/User.model.js';

export const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
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
          revenue: {
            $sum: {
              $multiply: ['$items.quantity', '$menuItemDetails.price']
            }
          }
        }
      }
    ]);

    const totalUsers = await User.countDocuments({ role: 'user' });

    const orderStatusCountsRaw = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const orderStatusCounts = orderStatusCountsRaw.map((s) => ({
      status: s._id,
      count: s.count,
    }));

    const revenueByCategoryRaw = await Order.aggregate([
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
          _id: '$menuItemDetails.category',
          revenue: {
            $sum: {
              $multiply: ['$items.quantity', '$menuItemDetails.price']
            }
          }
        }
      }
    ]);

    const revenueByCategory = revenueByCategoryRaw.map((c) => ({
      category: c._id,
      revenue: c.revenue
    }));

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.revenue || 0,
      totalUsers,
      orderStatusCounts,
      revenueByCategory
    });
  } catch (err) {
    console.error('Error in getAdminStats:', err);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
};
