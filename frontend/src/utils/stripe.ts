/**
 * Stripe Utility
 * Loads and initializes Stripe.js with the publishable key
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

/**
 * Get Stripe instance
 * Loads Stripe.js with the publishable key from environment variables
 * Uses singleton pattern to avoid multiple loads
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!key) {
      console.error('Stripe publishable key not configured');
      console.error('Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local');
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(key);
  }

  return stripePromise;
};
