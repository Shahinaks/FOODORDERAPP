import Order from '../models/Order.model.js';
import { MenuItem } from '../models/MenuItem.model.js';
import Coupon from '../models/Coupon.model.js';
import { sendOrderConfirmation } from '../utils/sendEmail.js';
import { getIO } from '../socket.js'; // ✅ socket.io instance

export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryAddress,
      restaurant,
      couponCode,
      paymentMethod,
      paymentMethodLabel,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item' });
    }

    let totalAmount = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found: ${item.menuItem}` });
      }
      totalAmount += menuItem.price * item.quantity;
    }

    // Apply coupon discount
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (coupon && new Date(coupon.expirationDate) >= new Date()) {
        discount = coupon.discountPercentage;
        totalAmount = totalAmount - (totalAmount * (discount / 100));
      } else {
        return res.status(400).json({ message: 'Invalid or expired coupon' });
      }
    }

    const shortId = Math.random().toString(36).substr(2, 6).toUpperCase();

    const newOrder = new Order({
      user: req.user._id,
      items,
      totalAmount,
      discount,
      coupon: couponCode || null,
      deliveryAddress,
      restaurant,
      paymentMethod,
      paymentMethodLabel,
      message: `✅ Order ${shortId} has been placed successfully! 🎉`,
    });

    const savedOrder = await newOrder.save();
    await sendOrderConfirmation(req.user.email, savedOrder._id);

    // ✅ Emit notification to this user using their Firebase UID
    const io = getIO();
    if (req.user.uid) {
      io.to(req.user.uid).emit('notification', {
        title: 'Order Placed',
        message: `✅ Order ${shortId} has been placed successfully! 🎉`,
      });
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.menuItem')
      .populate('restaurant', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get orders', error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.menuItem')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get all orders', error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('items.menuItem')
      .populate('restaurant', 'name')
      .populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.user._id.equals(req.user._id);
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['placed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: No user found' });
    }

    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.orderStatus = 'cancelled';

    await order.save({ validateBeforeSave: false });

    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    console.error('❌ Cancel Order Error:', err);
    res.status(500).json({ message: 'Failed to cancel order', error: err.message });
  }
};

export const filterOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { orderStatus: status } : {};
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.menuItem')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to filter orders', error: err.message });
  }
};

export const getOrderPaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to access this order' });
    }

    res.json({ paymentStatus: order.paymentStatus });
  } catch (err) {
    console.error('❌ Error checking payment status:', err);
    res.status(500).json({ message: 'Error retrieving payment status' });
  }
};
