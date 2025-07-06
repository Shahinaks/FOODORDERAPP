import React, { useEffect, useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';
const API = import.meta.env.VITE_API_URL;


const StripeCheckoutForm = ({
  orderId,
  amount,
  deliveryAddress,
  paymentMethod,
  saveRecentAddress,
  clearCart,
  setShowToast,
  setPlacingOrder
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const headers = { Authorization: `Bearer ${localStorage.getItem('firebaseToken')}` };

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await axios.post('/payments/intent', {
          amount: Math.round(amount * 100)
        }, { headers });

        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error('Payment intent creation error:', err);
        toast.error('Could not initiate payment.');
      }
    };

    if (orderId) {
      createPaymentIntent();
    }
  }, [amount, orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setError('');

    try {
      const cardElement = elements.getElement(CardNumberElement);
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement
        }
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        await axios.post('/payments', {
          order: orderId,
          amount,
          method: 'card',
          transactionId: paymentIntent.id,
          status: 'completed'
        }, { headers });

        const confirmRes = await axios.get(`/orders/${orderId}/payment-status`, { headers });

        if (confirmRes.data.paymentStatus === 'paid') {
          saveRecentAddress(deliveryAddress);
          clearCart();
          setShowToast(true);
          navigate(`/order-confirmation/${orderId}`);
        } else {
          setError('Payment succeeded but not reflected in the order. Contact support.');
        }
      } else {
        setError(`Payment failed with status: ${paymentIntent.status}`);
      }
    } catch (err) {
      console.error('Stripe error:', err);
      setError('Payment verification failed.');
    } finally {
      setLoading(false);
      setPlacingOrder(false);
    }
  };

  const stripeStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#111827',
        fontFamily: 'Segoe UI, sans-serif',
        '::placeholder': { color: '#6b7280' },
      },
      invalid: { color: '#e11d48' }
    }
  };

  const inputBoxStyle = {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: '#f9fafb'
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <h5 className="mb-3">Card Payment</h5>

      <Form.Group className="mb-3">
        <label>Card Number</label>
        <div style={inputBoxStyle}>
          <CardNumberElement options={stripeStyle} />
        </div>
      </Form.Group>

      <Row className="mb-3">
        <Col>
          <label>Expiry</label>
          <div style={inputBoxStyle}>
            <CardExpiryElement options={stripeStyle} />
          </div>
        </Col>
        <Col>
          <label>CVC</label>
          <div style={inputBoxStyle}>
            <CardCvcElement options={stripeStyle} />
          </div>
        </Col>
      </Row>

      <div className="text-muted small mb-3">
        We securely process your card using Stripe.
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-100"
        style={{ background: '#2563eb', border: 'none' }}
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Processing...
          </>
        ) : (
          `Pay ₹${amount.toFixed(2)}`
        )}
      </Button>
    </Form>
  );
};

export default StripeCheckoutForm;
