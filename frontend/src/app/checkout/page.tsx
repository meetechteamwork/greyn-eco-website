'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../../context/AuthContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Card Element Styles
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};

function CheckoutForm({ productName, productPrice, productId }: { productName: string; productPrice: string; productId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Parse price to get numeric value
  const getPriceValue = (price: string): number => {
    const numStr = price.replace(/[^0-9.]/g, '');
    return parseFloat(numStr) || 0;
  };

  const priceValue = getPriceValue(productPrice);
  const taxAmount = priceValue * 0.18; // 18% GST
  const totalAmount = priceValue + taxAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveStep(2);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe not loaded. Please refresh the page.');
      return;
    }

    if (!isAuthenticated) {
      setError('Please login to complete payment.');
      router.push('/auth');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get auth token
      const token = localStorage.getItem('token');

      // Create payment intent on backend
      const response = await fetch(`${API_BASE_URL}/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId || undefined,
          amount: totalAmount,
          productName: productName,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment intent');
      }

      const { clientSecret, carbonUnits, carbonCredits } = data.data;

      // Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: {
              city: formData.city,
              state: formData.state,
              postal_code: formData.pincode,
              line1: formData.address,
            },
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        setActiveStep(3);

        // Store carbon credits info for display
        localStorage.setItem('lastPurchase', JSON.stringify({
          productName,
          amount: totalAmount,
          carbonUnits,
          carbonCredits,
          paymentIntentId: paymentIntent.id,
        }));
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
          <svg className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
        <p className="text-gray-600 mb-6">Please login to continue with checkout.</p>
        <Link
          href="/auth?action=checkout"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl transition-all"
        >
          Login to Continue
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Main Form */}
      <div className="lg:col-span-2">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          {[
            { num: 1, label: 'Shipping' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Complete' }
          ].map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full font-bold transition-all ${
                    activeStep >= step.num
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg scale-110'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  }`}
                >
                  {activeStep > step.num ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.num
                  )}
                </div>
                <span className={`text-xs font-semibold ${activeStep >= step.num ? 'text-green-700' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {idx < 2 && (
                <div className={`h-1 w-16 rounded-full transition-all ${activeStep > step.num ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Step 1: Shipping */}
          {activeStep === 1 && (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Shipping Information</h2>
                <p className="text-sm text-gray-500">Please provide your delivery details</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Street address, apartment, suite, etc."
                  required
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="Mumbai"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="Maharashtra"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    placeholder="400001"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {/* Step 2: Payment */}
          {activeStep === 2 && (
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Payment Details</h2>
                <p className="text-sm text-gray-500">Secure payment powered by Stripe</p>
              </div>

              {/* Shipping Summary */}
              <div className="rounded-2xl bg-gray-50 p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Shipping To:</h3>
                <p className="text-sm text-gray-600">
                  {formData.fullName}<br />
                  {formData.address}<br />
                  {formData.city}, {formData.state} - {formData.pincode}
                </p>
              </div>

              {/* Card Element */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Card Details *</label>
                <div className="rounded-xl border-2 border-gray-200 px-4 py-4 transition-all focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200">
                  <CardElement options={cardElementOptions} />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Your payment information is securely processed by Stripe.
                </p>
              </div>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-4 py-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs">SSL Secured</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs">PCI Compliant</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-6 py-4 font-semibold text-gray-700 transition-all hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !stripe}
                  className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Pay Rs. {totalAmount.toFixed(2)}</>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success */}
          {activeStep === 3 && success && (
            <div className="text-center py-8">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>

              <div className="rounded-2xl bg-green-50 border border-green-200 p-6 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌱</span>
                  <div className="text-left">
                    <h4 className="font-semibold text-green-900">Carbon Credits Earned!</h4>
                    <p className="mt-1 text-sm text-green-700">
                      You've earned carbon credits with this eco-friendly purchase.
                      Check your dashboard to see your environmental impact.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  View Dashboard
                </Link>
                <Link
                  href="/products"
                  className="rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
          <h3 className="mb-6 text-xl font-bold text-gray-900">Order Summary</h3>

          <div className="mb-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-4">
            <div className="mb-2 text-sm font-semibold text-gray-600">Product</div>
            <div className="text-lg font-bold text-gray-900">{productName || 'Product'}</div>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">Rs. {priceValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (18% GST)</span>
              <span className="font-semibold text-gray-900">Rs. {taxAmount.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-green-600">Rs. {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">🌱</span>
              <div className="text-xs text-green-800">
                <div className="font-semibold">Eco-Friendly Purchase</div>
                <div className="mt-1">This product is made from recycled materials and supports sustainable practices. Earn carbon credits with every purchase!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();

  const productName = searchParams.get('name') || 'Eco Product';
  const productPrice = searchParams.get('price') || 'Rs. 0';
  const productId = searchParams.get('id') || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/20">
      <Header />

      <main className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/products" className="hover:text-green-600 transition-colors">Products</Link>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-semibold text-gray-900">Checkout</span>
          </nav>

          <Elements stripe={stripePromise}>
            <CheckoutForm productName={productName} productPrice={productPrice} productId={productId} />
          </Elements>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
