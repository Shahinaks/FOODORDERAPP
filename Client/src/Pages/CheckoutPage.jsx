import React, { useEffect, useState } from 'react';
import {
  Button, Form, Modal, ListGroup, Alert, Toast, ToastContainer, Image, Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';
import StripeCheckoutForm from '../components/StripeCheckoutForm';
import { useCart } from '../context/CartContext';
const API = import.meta.env.VITE_API_URL;


const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [recentAddresses, setRecentAddresses] = useState([]);
  const [useRecentAddress, setUseRecentAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentMethodLabel, setPaymentMethodLabel] = useState('Cash on Delivery');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [stripeOrderId, setStripeOrderId] = useState(null);
  const { clearCart } = useCart();


  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${localStorage.getItem('firebaseToken')}` };

  useEffect(() => {
    fetchCart();
    fetchCoupons();
    loadRecentAddresses();
  }, []);

  useEffect(() => {
    if (['creditcard', 'debitcard'].includes(paymentMethod)) {
      if (cartItems.length === 0) return;
      if (!deliveryAddress.trim()) {
        setError('Please enter a delivery address.');
        return;
      }
      createOrderForStripe();
    } else {
      setStripeOrderId(null);
      setError('');
    }
  }, [paymentMethod, deliveryAddress, cartItems]);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/cart', { headers });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('/coupons/available', { headers });
      const valid = res.data.filter(c => c.isActive && new Date(c.expirationDate) > new Date());
      setAvailableCoupons(valid);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    }
  };

  const loadRecentAddresses = () => {
    const stored = localStorage.getItem('recentAddresses');
    try {
      const parsed = stored ? JSON.parse(stored) : [];
      setRecentAddresses(parsed);
    } catch {
      setRecentAddresses([]);
    }
  };

  const saveRecentAddress = (addr) => {
    const updated = [addr, ...recentAddresses.filter(a => a !== addr)].slice(0, 3);
    localStorage.setItem('recentAddresses', JSON.stringify(updated));
    setRecentAddresses(updated);
  };

  const calculateSubtotal = () =>
    cartItems.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);

  const calculateDiscount = () =>
    appliedCoupon ? (calculateSubtotal() * appliedCoupon.discountPercentage) / 100 : 0;

  const calculateTotal = () => calculateSubtotal() - calculateDiscount();

  const estimateDeliveryTime = () => {
    const min = 30, max = 45;
    return `${Math.floor(Math.random() * (max - min + 1)) + min} mins`;
  };

  const createOrderForStripe = async () => {
    setError('');
    setPlacingOrder(true);
    try {
      const restaurant = cartItems[0]?.menuItem?.restaurant;
      if (!restaurant) {
        toast.error('Missing restaurant info.');
        setPlacingOrder(false);
        return;
      }

      const res = await axios.post('/orders', {
        items: cartItems.map(item => ({
          menuItem: item.menuItem._id,
          quantity: item.quantity,
        })),
        deliveryAddress,
        restaurant,
        couponCode: appliedCoupon?.code || '',
        paymentMethod,
        paymentMethodLabel,
      }, { headers });

      setStripeOrderId(res.data._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order creation failed');
      setStripeOrderId(null);
    } finally {
      setPlacingOrder(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      setError('Please enter a delivery address.');
      return;
    }
    setError('');
    setPlacingOrder(true);

    try {
      const restaurant = cartItems[0]?.menuItem?.restaurant;
      if (!restaurant) {
        toast.error('Missing restaurant info.');
        setPlacingOrder(false);
        return;
      }

      const response = await axios.post('/orders', {
        items: cartItems.map(item => ({
          menuItem: item.menuItem._id,
          quantity: item.quantity,
        })),
        deliveryAddress,
        restaurant,
        couponCode: appliedCoupon?.code || '',
        paymentMethod,
        paymentMethodLabel
      }, { headers });

      const newOrderId = response.data._id;
      await axios.post('/payments', {
        order: newOrderId,
        amount: calculateTotal(),
        method: paymentMethod,
        transactionId: '',  
        status: 'pending'
      }, { headers });

      await clearCart();
      saveRecentAddress(deliveryAddress);
      setPlacingOrder(false);
      navigate(`/order-confirmation/${newOrderId}`);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
      setPlacingOrder(false);
    }
  };

  const applyCoupon = () => {
    const match = availableCoupons.find(c => c.code === couponCode.trim());
    if (match) {
      setAppliedCoupon(match);
      toast.success(`Applied coupon ${match.code}`);
    } else {
      setAppliedCoupon(null);
      toast.error('Invalid coupon');
    }
  };

  return (
    <div className="checkout-page" style={{ backgroundColor: '#f5f7f8', minHeight: '100vh', padding: '2rem 0', color: '#2d2d2d' }}>
      <div className="container">
        <div className="card p-4 shadow-sm rounded-4" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-center mb-4">Checkout</h2>

          {cartItems.length === 0 ? (
            <Alert variant="light" className="text-center">Your cart is empty.</Alert>
          ) : (
            <>
              <ListGroup className="mb-4">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id} className="d-flex align-items-center">
                    <Image src={item.menuItem.image} alt={item.menuItem.name} rounded style={{ width: 60, height: 60, marginRight: 15 }} />
                    <div className="flex-grow-1">
                      <strong>{item.menuItem.name}</strong><br />Quantity: {item.quantity}
                    </div>
                    <div className="fw-bold">₹{(item.menuItem.price * item.quantity).toFixed(2)}</div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <Form.Check
                className="mb-2"
                type="switch"
                label="Use recent address"
                checked={useRecentAddress}
                onChange={() => { setUseRecentAddress(!useRecentAddress); setDeliveryAddress(''); }}
              />
              {useRecentAddress ? (
                <Form.Select className="mb-3" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}>
                  <option>Choose address</option>
                  {recentAddresses.map((addr, i) => <option key={i} value={addr}>{addr}</option>)}
                </Form.Select>
              ) : (
                <Form.Control
                  className="mb-3"
                  placeholder="Enter delivery address"
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                />
              )}

              <Form.Select
                className="mb-3"
                value={paymentMethod}
                onChange={(e) => {
                  const selectedOption = e.target.options[e.target.selectedIndex];
                  setPaymentMethod(e.target.value);
                  setPaymentMethodLabel(selectedOption.text);
                }}
              >
                <option value="cash">Cash on Delivery</option>
                <option value="debitcard">Debit Card</option>
                <option value="creditcard">Credit Card</option>
              </Form.Select>

              {['creditcard', 'debitcard'].includes(paymentMethod) ? (
                <>
                  {placingOrder && <div className="mb-3 text-center text-muted">Preparing payment form...</div>}
                  {stripeOrderId && (
                    <StripeCheckoutForm
                      orderId={stripeOrderId}
                      amount={calculateTotal()}
                      deliveryAddress={deliveryAddress}
                      cartItems={cartItems}
                      appliedCoupon={appliedCoupon}
                      paymentMethod={paymentMethod}
                      saveRecentAddress={saveRecentAddress}
                      clearCart={fetchCart}
                      setShowToast={setShowToast}
                      setPlacingOrder={setPlacingOrder}
                    />
                  )}
                </>
              ) : null}

              <div className="d-flex mb-3">
                <Form.Control
                  className="me-2"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                />
                <Button variant="outline-secondary" onClick={applyCoupon}>Apply</Button>
                <Button variant="outline-dark" className="ms-2" onClick={() => setShowModal(true)}>View Coupons</Button>
              </div>

              {appliedCoupon && <Alert variant="success">Applied {appliedCoupon.code} — {appliedCoupon.discountPercentage}% off</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <div className="rounded p-3 mb-3" style={{ backgroundColor: '#eef1f5' }}>
                <p><strong>Subtotal:</strong> ₹{calculateSubtotal().toFixed(2)}</p>
                {appliedCoupon && <p><strong>Discount:</strong> -₹{calculateDiscount().toFixed(2)}</p>}
                <h5>Total: ₹{calculateTotal().toFixed(2)}</h5>
                <p className="text-muted">🚚 Estimated delivery: {estimateDeliveryTime()}</p>
              </div>

              {!['creditcard', 'debitcard'].includes(paymentMethod) && (
                <Button
                  className="w-100 fw-bold"
                  style={{ background: '#5a7d7c' }}
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                >
                  {placingOrder ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Placing Order...
                    </>
                  ) : 'Confirm Order'}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Available Coupons</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {availableCoupons.length === 0 ? (
            <p>No active coupons available.</p>
          ) : (
            <ListGroup>
              {availableCoupons.map(coupon => (
                <ListGroup.Item
                  key={coupon._id}
                  action
                  onClick={() => {
                    setAppliedCoupon(coupon);
                    setCouponCode(coupon.code);
                    setShowModal(false);
                    toast.success(`Applied ${coupon.code}`);
                  }}
                >
                  <strong>{coupon.code}</strong> — {coupon.discountPercentage}% off
                  <div className="text-muted small">{coupon.description}</div>
                  <div className="text-muted small">Expires: {new Date(coupon.expirationDate).toLocaleDateString()}</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
      </Modal>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg="success"
          onClose={() => {
            setShowToast(false);
            navigate('/order-confirmation');
          }}
          show={showToast}
          delay={2500}
          autohide
        >
          <Toast.Body className="text-white">✅ Order placed successfully!</Toast.Body>
        </Toast>
      </ToastContainer>

      {placingOrder && ['cash', 'upi', 'gpay'].includes(paymentMethod) && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.7)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
          }}
        >
          <Spinner animation="border" variant="secondary" style={{ width: '4rem', height: '4rem' }} />
          <p className="mt-3 fs-5 text-secondary">Placing your order...</p>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
