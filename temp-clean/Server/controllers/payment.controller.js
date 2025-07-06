import stripe from '../config/stripe.js';
import Payment from '../models/Payment.model.js';
import Order from '../models/Order.model.js'; 

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount < 50) {
      return res.status(400).json({ message: 'Amount must be at least ₹0.50 (50 paise)' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated or not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount, 10),
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: req.user._id.toString(),
        email: req.user.email,
      },
    });

    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('❌ Stripe error (intent):', err);
    res.status(500).json({ message: 'PaymentIntent creation failed', error: err.message });
  }
};

export const storePayment = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated or not found' });
    }

    const { order, amount, method, transactionId, status } = req.body;

    const payment = new Payment({
      user: req.user._id,
      order,
      amount,
      method,
      transactionId,
      status: status || 'completed', 
      paidAt: status === 'completed' ? new Date() : null
    });

    await payment.save();

    if (status === 'completed') {
      await Order.findByIdAndUpdate(order, {
        paymentStatus: 'paid',
        paymentMethod: method
      });
    }

    res.status(201).json(payment);
  } catch (err) {
    console.error('❌ Payment saving error:', err);
    res.status(500).json({ message: 'Payment record saving failed', error: err.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('order', '_id totalAmount paymentStatus');
    res.json(payments);
  } catch (err) {
    console.error('❌ Failed to fetch payments:', err);
    res.status(500).json({ message: 'Failed to fetch payments', error: err.message });
  }
};
