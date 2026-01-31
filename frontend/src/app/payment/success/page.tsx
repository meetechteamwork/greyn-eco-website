'use client';

/**
 * Payment Success Page
 * Displays carbon credit report after successful payment
 */

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/utils/api';

interface PaymentData {
  paymentIntentId: string;
  status: string;
  amount: number;
  productName: string;
  carbonUnits: number;
  carbonCredits: number;
  paymentMethod?: string;
  last4?: string;
  brand?: string;
  createdAt: string;
}

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  useEffect(() => {
    if (!paymentIntentId) {
      setError('Payment ID not found');
      setLoading(false);
      return;
    }

    fetchPaymentStatus();
  }, [paymentIntentId]);

  const fetchPaymentStatus = async () => {
    try {
      setLoading(true);
      const response = await api.payment.getStatus(paymentIntentId!);

      if (response.success && response.data) {
        setPaymentData(response.data as PaymentData);
      } else {
        setError(response.message || 'Failed to retrieve payment information');
      }
    } catch (err: any) {
      console.error('Error fetching payment status:', err);
      setError('Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Payment information not available'}</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCardBrand = (brand?: string) => {
    if (!brand) return 'Card';
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-green-100 rounded-full p-6 mb-4">
            <svg
              className="w-16 h-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase and contribution to the environment
          </p>
        </div>

        {/* Carbon Credit Report */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">🌱 Carbon Credit Report</h2>
            <p className="text-green-100">Your environmental impact summary</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Amount Paid */}
            <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
              <span className="text-gray-600 font-medium">Amount Paid</span>
              <span className="text-3xl font-bold text-gray-800">
                ${paymentData.amount.toFixed(2)}
              </span>
            </div>

            {/* Product Name */}
            <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
              <span className="text-gray-600 font-medium">Product</span>
              <span className="text-lg font-semibold text-gray-800">
                {paymentData.productName}
              </span>
            </div>

            {/* Carbon Credits Earned - Highlighted */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-700 font-bold text-lg">
                  CO₂ Units Earned
                </span>
                <span className="text-4xl font-bold text-green-600">
                  {paymentData.carbonUnits}
                </span>
              </div>
              <p className="text-sm text-gray-600 text-right">
                Equivalent to offsetting {(paymentData.carbonUnits / 1000).toFixed(2)} tons of CO₂
              </p>
            </div>

            {/* Payment Method */}
            {paymentData.paymentMethod && (
              <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
                <span className="text-gray-600 font-medium">Payment Method</span>
                <span className="text-gray-800 font-semibold">
                  {formatCardBrand(paymentData.brand)} •••• {paymentData.last4}
                </span>
              </div>
            )}

            {/* Transaction Date */}
            <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
              <span className="text-gray-600 font-medium">Transaction Date</span>
              <span className="text-gray-800 font-semibold">
                {formatDate(paymentData.createdAt)}
              </span>
            </div>

            {/* Transaction ID */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Transaction ID</span>
              <span className="text-gray-500 text-sm font-mono">
                {paymentData.paymentIntentId.substring(0, 20)}...
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/wallet')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            View Wallet
          </button>
          <button
            onClick={() => router.push('/products')}
            className="bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Continue Shopping
          </button>
        </div>

        {/* Environmental Impact Message */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 text-center">
          <p className="text-gray-700 text-lg">
            🌍 <strong>Thank you for making a difference!</strong>
          </p>
          <p className="text-gray-600 mt-2">
            Your purchase helps fund environmental projects and contributes to a sustainable future.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
