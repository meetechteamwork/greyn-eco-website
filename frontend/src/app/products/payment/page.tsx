'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const productName = searchParams.get('name') || 'Product';
  const productPrice = searchParams.get('price') || 'Rs. 0';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeStep === 1) {
      setActiveStep(2);
    } else if (activeStep === 2) {
      setActiveStep(3);
    } else {
      alert('Order placed successfully! 🎉');
      router.push('/dashboard');
    }
  };

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

          {/* Progress Steps */}
          <div className="mb-12 flex items-center justify-center gap-4">
            {[
              { num: 1, label: 'Shipping' },
              { num: 2, label: 'Payment' },
              { num: 3, label: 'Confirm' }
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

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
                {/* Step 1: Shipping */}
                {activeStep === 1 && (
                  <div className="space-y-6">
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
                  </div>
                )}

                {/* Step 2: Payment */}
                {activeStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="mb-2 text-2xl font-bold text-gray-900">Payment Method</h2>
                      <p className="text-sm text-gray-500">Choose your preferred payment option</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      {[
                        { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                        { id: 'upi', label: 'UPI Payment', icon: '📱' },
                        { id: 'cod', label: 'Cash on Delivery', icon: '💵' }
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={`rounded-2xl border-2 p-6 text-center transition-all ${
                            paymentMethod === method.id
                              ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                              : 'border-gray-200 bg-white hover:border-green-300'
                          }`}
                        >
                          <div className="mb-2 text-4xl">{method.icon}</div>
                          <div className="text-sm font-semibold text-gray-900">{method.label}</div>
                        </button>
                      ))}
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-8 space-y-6">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">Card Number *</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">Cardholder Name *</label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">Expiry Date *</label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                              placeholder="MM/YY"
                              required
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">CVV *</label>
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                              placeholder="123"
                              maxLength={3}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'upi' && (
                      <div className="mt-8">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">UPI ID *</label>
                        <input
                          type="text"
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                          placeholder="yourname@upi"
                          required
                        />
                      </div>
                    )}

                    {paymentMethod === 'cod' && (
                      <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">ℹ️</span>
                          <div>
                            <h4 className="font-semibold text-amber-900">Cash on Delivery</h4>
                            <p className="mt-1 text-sm text-amber-700">
                              Pay with cash when your order is delivered. Additional charges may apply.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {activeStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="mb-2 text-2xl font-bold text-gray-900">Review Your Order</h2>
                      <p className="text-sm text-gray-500">Please confirm your details before placing the order</p>
                    </div>

                    <div className="space-y-4 rounded-2xl bg-gray-50 p-6">
                      <div className="flex justify-between border-b border-gray-200 pb-3">
                        <span className="font-semibold text-gray-700">Shipping To:</span>
                        <span className="text-right text-sm text-gray-900">
                          {formData.fullName}<br />
                          {formData.address}<br />
                          {formData.city}, {formData.state} - {formData.pincode}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-3">
                        <span className="font-semibold text-gray-700">Contact:</span>
                        <span className="text-sm text-gray-900">
                          {formData.email}<br />
                          {formData.phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Payment Method:</span>
                        <span className="text-sm font-semibold text-green-600">
                          {paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4">
                  {activeStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setActiveStep(prev => prev - 1)}
                      className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-6 py-4 font-semibold text-gray-700 transition-all hover:bg-gray-50"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
                  >
                    {activeStep === 3 ? 'Place Order' : 'Continue'}
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-3xl border border-gray-100 bg-white p-6 shadow-xl">
                <h3 className="mb-6 text-xl font-bold text-gray-900">Order Summary</h3>
                
                <div className="mb-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-4">
                  <div className="mb-2 text-sm font-semibold text-gray-600">Product</div>
                  <div className="text-lg font-bold text-gray-900">{productName}</div>
                </div>

                <div className="space-y-4 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">{productPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (18% GST)</span>
                    <span className="font-semibold text-gray-900">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-green-600">{productPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🌱</span>
                    <div className="text-xs text-green-800">
                      <div className="font-semibold">Eco-Friendly Purchase</div>
                      <div className="mt-1">This product is made from 100% recycled materials and supports sustainable practices.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

