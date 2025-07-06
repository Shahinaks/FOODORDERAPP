import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;


const stripePromise = loadStripe('pk_test_YourPublishableKeyHere');

const CheckoutForm = ({ orderId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) return;

    try {
      const { data } = await axios.post('/api/payments/create-payment-intent', {
        amount: amount * 100,
        currency: 'usd'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const clientSecret = data.clientSecret;

      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement }
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
        setLoading(false);
        return;
      }

      if (paymentResult.paymentIntent.status === 'succeeded') {
        await axios.post('/api/payments', {
          order: orderId,
          amount,
          method: 'card',
          transactionId: paymentResult.paymentIntent.id
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h3>Pay ${amount}</h3>
      <CardElement />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Payment successful!</p>}
      <button disabled={!stripe || loading} style={{ marginTop: 10 }}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const PaymentPage = ({ orderId, amount }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm orderId={orderId} amount={amount} />
  </Elements>
);

export default PaymentPage;
