import Coupon from '../models/Coupon.model.js';

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate } = req.body;
    const existing = await Coupon.findOne({ code });
    if (existing) return res.status(400).json({ message: 'Coupon already exists' });

    const coupon = new Coupon({ code, discountPercentage, expirationDate });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create coupon' });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ expirationDate: 1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch coupons' });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete coupon' });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon || new Date(coupon.expirationDate) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired coupon' });
    }

    res.json({ discount: coupon.discountPercentage });
  } catch (err) {
    res.status(500).json({ message: 'Failed to apply coupon' });
  }
};
export const getAvailableCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({ isActive: true, expirationDate: { $gte: now } });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch available coupons' });
  }
};
