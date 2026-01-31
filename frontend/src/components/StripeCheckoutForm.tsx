'use client';

/**
 * Stripe Checkout Form Component
 * Handles payment processing with Stripe Elements
 */

import React, { useState, FormEvent } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';

interface StripeCheckoutFormProps {
  amount: number;
  productName: string;
  carbonUnits: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  amount,
  productName,
  carbonUnits,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage('Stripe has not loaded yet. Please try again.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        // Payment failed
        const message = error.message || 'An unexpected error occurred.';
        setErrorMessage(message);
        onError(message);
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded
        onSuccess(paymentIntent.id);
      } else {
        // Payment requires additional action or is processing
        setErrorMessage('Payment is being processed. Please wait...');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      const message = err.message || 'Payment failed. Please try again.';
      setErrorMessage(message);
      onError(message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Payment Summary */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Product:</span>
            <span className="font-semibold text-gray-800">{productName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-2xl text-gray-800">
              ${amount.toFixed(2)}
            </span>
          </div>

          <div className="border-t-2 border-green-200 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-semibold">
                🌱 Carbon Credits Earned:
              </span>
              <span className="font-bold text-2xl text-green-600">
                {carbonUnits} CO₂ units
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-right">
              1 USD = 10 CO₂ units
            </p>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stripe Payment Element */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Payment Details
          </h3>
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex items-start">
              <span className="text-red-600 text-xl mr-3">⚠️</span>
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Payment Error</h4>
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
            !stripe || isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing Payment...
            </span>
          ) : (
            `Pay $${amount.toFixed(2)} & Earn ${carbonUnits} CO₂ Units`
          )}
        </button>

        {/* Security Notice */}
        <div className="text-center text-sm text-gray-500">
          <p>🔒 Secure payment powered by Stripe</p>
          <p className="mt-1">Your payment information is encrypted and secure</p>
        </div>
      </form>
    </div>
  );
};

export default StripeCheckoutForm;
