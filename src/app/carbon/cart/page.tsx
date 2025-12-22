'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  id: string;
  projectName: string;
  ngoName: string;
  location: string;
  pricePerTonne: number;
  quantity: number;
  availableCredits: number;
  isVerified: boolean;
  impactType: string;
}

// Mock project data - In a real app, this would come from a context or API
const mockProjectsData: Record<string, Omit<CartItem, 'quantity'>> = {
  '1': {
    id: '1',
    projectName: 'Amazon Rainforest Conservation',
    ngoName: 'Rainforest Alliance',
    location: 'Amazon Basin, Brazil',
    pricePerTonne: 15.50,
    availableCredits: 125000,
    isVerified: true,
    impactType: 'Forest Conservation',
  },
  '2': {
    id: '2',
    projectName: 'Solar Energy Farm Initiative',
    ngoName: 'Green Energy Foundation',
    location: 'California, USA',
    pricePerTonne: 22.00,
    availableCredits: 85000,
    isVerified: true,
    impactType: 'Renewable Energy',
  },
  '3': {
    id: '3',
    projectName: 'Mangrove Restoration Program',
    ngoName: 'Ocean Conservation Trust',
    location: 'Sundarbans, Bangladesh',
    pricePerTonne: 18.75,
    availableCredits: 95000,
    isVerified: true,
    impactType: 'Marine Conservation',
  },
  '4': {
    id: '4',
    projectName: 'Wind Power Development',
    ngoName: 'Clean Air Initiative',
    location: 'Scotland, UK',
    pricePerTonne: 25.00,
    availableCredits: 110000,
    isVerified: true,
    impactType: 'Renewable Energy',
  },
  '5': {
    id: '5',
    projectName: 'Community Reforestation Project',
    ngoName: 'Trees for Life',
    location: 'Kenya',
    pricePerTonne: 12.00,
    availableCredits: 65000,
    isVerified: false,
    impactType: 'Reforestation',
  },
  '6': {
    id: '6',
    projectName: 'Waste-to-Energy Conversion',
    ngoName: 'Sustainable Cities Network',
    location: 'Singapore',
    pricePerTonne: 30.00,
    availableCredits: 45000,
    isVerified: true,
    impactType: 'Waste Management',
  },
};

export default function CarbonCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage (in a real app, this would come from context/API)
    const savedCart = localStorage.getItem('carbonCart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed);
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem('carbonCart', JSON.stringify(items));
    setCartItems(items);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }

    const project = mockProjectsData[id];
    if (!project) return;

    const maxQuantity = Math.min(project.availableCredits, 10000); // Limit to 10k tonnes per item
    
    const actualQuantity = Math.min(newQuantity, maxQuantity);
    
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: actualQuantity } : item
    );
    saveCart(updatedItems);
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    saveCart(updatedItems);
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      saveCart([]);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.pricePerTonne * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCredits = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedTax = subtotal * 0.05; // 5% tax
  const total = subtotal + estimatedTax;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                Review and manage your carbon credit purchases
              </p>
            </div>
            <Link
              href="/carbon/marketplace"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Start adding carbon credits to your cart</p>
            <Link
              href="/carbon/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Browse Marketplace
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {/* Cart Header */}
              <div className="flex items-center justify-between bg-white rounded-xl shadow-md border border-gray-200 px-4 sm:px-6 py-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Cart Items ({cartItems.length})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </button>
              </div>

              {/* Cart Items List */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Project Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 break-words">
                              {item.projectName}
                            </h3>
                            <p className="text-sm font-semibold text-green-600 mb-2">
                              {item.ngoName}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <span>📍</span>
                                <span>{item.location}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span>🌍</span>
                                <span>{item.impactType}</span>
                              </span>
                            </div>
                          </div>
                          {item.isVerified && (
                            <div className="flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white rounded-full text-xs font-bold flex-shrink-0">
                              <span>✓</span>
                              <span className="hidden sm:inline">Verified</span>
                              <span className="sm:hidden">Verif</span>
                            </div>
                          )}
                        </div>

                        {/* Price and Quantity Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-xs sm:text-sm text-gray-600 font-medium">Price per Tonne</span>
                              <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                ${item.pricePerTonne.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-gray-300">|</div>
                            <div>
                              <span className="text-xs sm:text-sm text-gray-600 font-medium">Subtotal</span>
                              <p className="text-lg sm:text-xl font-bold text-gray-900">
                                ${(item.pricePerTonne * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                            <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors font-bold"
                                disabled={item.quantity <= 1}
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min="1"
                                max={Math.min(item.availableCredits, 10000)}
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 1;
                                  updateQuantity(item.id, val);
                                }}
                                className="w-20 sm:w-24 text-center text-sm sm:text-base font-bold text-gray-900 border-0 focus:ring-0 focus:outline-none"
                              />
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors font-bold"
                                disabled={item.quantity >= Math.min(item.availableCredits, 10000)}
                              >
                                +
                              </button>
                            </div>
                            <span className="text-xs text-gray-500 hidden sm:inline">
                              tonnes
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="sm:self-start px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 border border-red-200 sm:border-0"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="sm:hidden">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-96 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Credits</span>
                    <span className="font-semibold text-gray-900">{totalCredits.toLocaleString()} tCO₂</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Items</span>
                    <span className="font-semibold text-gray-900">{totalItems.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Estimated Tax (5%)</span>
                    <span className="font-semibold text-gray-900">${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3.5 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all mb-4">
                  Proceed to Checkout
                </button>

                <Link
                  href="/carbon/marketplace"
                  className="block w-full text-center py-2.5 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Environmental Impact Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span>🌳</span> Environmental Impact
                    </h3>
                    <p className="text-xs text-gray-600">
                      By purchasing {totalCredits.toLocaleString()} carbon credits, you're offsetting approximately{' '}
                      <span className="font-bold text-green-600">{totalCredits.toLocaleString()}</span> tonnes of CO₂ emissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


