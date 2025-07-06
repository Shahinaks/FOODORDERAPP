import React, { useEffect, useState } from 'react';
import { Button, Spinner, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaCheckCircle,
  FaMoneyBillWave,
  FaCreditCard,
  FaUniversity,
  FaQrcode,
} from 'react-icons/fa';
import { SiGooglepay } from 'react-icons/si';
import { motion } from 'framer-motion';
import axios from '../api/axiosInstance';
const API = import.meta.env.VITE_API_URL;


const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const headers = { Authorization: `Bearer ${localStorage.getItem('firebaseToken')}` };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRes = await axios.get(`/orders/${orderId}`, { headers });
        setOrder(orderRes.data);

        const paymentRes = await axios.get(`/orders/${orderId}/payment-status`, { headers });
        setPaymentStatus(paymentRes.data.paymentStatus || 'pending');
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const methodStyles = {
    cash: { icon: <FaMoneyBillWave />, color: '#d97706', label: 'Cash on Delivery' },
    upi: { icon: <FaQrcode />, color: '#0d9488', label: 'UPI' },
    gpay: { icon: <SiGooglepay />, color: '#0f172a', label: 'Gpay' },
    googlepay: { icon: <SiGooglepay />, color: '#0f172a', label: 'Google Pay' },
    debitcard: { icon: <FaUniversity />, color: '#2563eb', label: 'Debit Card' },
    creditcard: { icon: <FaCreditCard />, color: '#7c3aed', label: 'Credit Card' },
    unknown: { icon: <FaMoneyBillWave />, color: '#6b7280', label: 'Unknown' },
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh' }} className="d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-5"><h4>Order not found.</h4></div>;
  }

  const isPaid = paymentStatus === 'paid';
  const rawMethod = order.paymentMethod || 'unknown';
  const normalizedMethod = rawMethod.replace(/\s+/g, '').toLowerCase();
  const fallbackMethod = methodStyles[normalizedMethod] || methodStyles['unknown'];

  const isCard = ['creditcard', 'debitcard'].includes(normalizedMethod);

  const method = {
    icon: fallbackMethod.icon,
    color: fallbackMethod.color,
    label: order.paymentMethodLabel?.trim() || fallbackMethod.label || (isCard ? 'Card Payment' : 'Unknown'),
  };

  console.log('🚀 Order method label:', order.paymentMethodLabel);

  const subtotal = order.items.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const discount = order.discount || 0;
  const total = subtotal - discount;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          maxWidth: 600,
          background: '#ffffff',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          width: '100%',
        }}
      >
        <div className="text-center mb-4">
          <FaCheckCircle size={70} color="#22c55e" />
          <h3 className="mt-3">Order Receipt</h3>
          <small className="text-muted">Order #{order._id}</small>
        </div>

        <Table responsive borderless size="sm">
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              <th>Item</th>
              <th>Qty</th>
              <th className="text-end">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.menuItem._id}>
                <td>{item.menuItem.name}</td>
                <td>{item.quantity}</td>
                <td className="text-end">₹{(item.menuItem.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2}>Subtotal</td>
              <td className="text-end">₹{subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={2}>Discount</td>
              <td className="text-end text-success">– ₹{discount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={2}><strong>Total</strong></td>
              <td className="text-end"><strong>₹{total.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </Table>

        <div className="mt-4 d-flex justify-content-between align-items-center">
          <div style={{ color: method.color, fontWeight: '500' }}>
            {method.icon} {method.label}
            <br />
            <small className="text-muted">({rawMethod})</small>
          </div>
          <span style={{ fontWeight: '600', color: isPaid ? '#16a34a' : '#eab308' }}>
            {isPaid ? 'Paid ✅' : 'Pending'}
          </span>
        </div>

        <hr />

        <div className="text-muted small mb-3">Delivery Address:</div>
        <div style={{ fontSize: '14px', marginBottom: '20px' }}>{order.deliveryAddress}</div>

        <div className="text-center">
          <Button variant="success" onClick={() => navigate('/my-orders')}>
            View My Orders
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;
