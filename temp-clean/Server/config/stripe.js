// config/stripe.js
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing in .env');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
