import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutPage from '../Pages/CheckoutPage';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); 

const StripeWrapper = () => (
  <Elements stripe={stripePromise}>
    <CheckoutPage />
  </Elements>
);

export default StripeWrapper;
