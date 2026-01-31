'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../../utils/api';

type Product = {
  _id: string;
  id?: string;
  name: string;
  variant?: string;
  detailLabel?: string;
  detailValue?: string;
  badge?: string;
  tag?: string;
  price: string;
  rating: number;
  reviews: number;
  note?: string;
  image: string;
};

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.public.products.get({ limit: 100 });
        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          setError(response.message || 'Failed to load products');
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  const handleManualScroll = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.querySelector('article') as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth + 24 : 340;

    slider.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth'
    });
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1 text-[#f4b400]">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill={index < Math.round(rating) ? '#f4b400' : '#d9d9d9'}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 1.5l2.472 5.003 5.528.804-4 3.897.944 5.5L10 13.75l-4.944 2.954.944-5.5-4-3.897 5.528-.804L10 1.5z" />
        </svg>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="px-6 py-14 md:py-16">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-gray-600">Loading products...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="px-6 py-14 md:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-red-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-gray-900">
              Unable to Load Products
            </h3>
            <p className="mb-8 text-lg text-gray-600">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-full bg-[#008a6c] px-6 py-3 text-white transition hover:bg-[#00785d]"
            >
              <span>Try Again</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="px-6 py-14 md:py-16">
        <section className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-semibold text-gray-900">Featured Products</h1>
              <p className="text-sm text-gray-500">Circular pieces handcrafted from ecobricks & reclaimed plastic.</p>
            </div>
            {products.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleManualScroll('left')}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:bg-gray-50"
                >
                  <span className="sr-only">Previous products</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleManualScroll('right')}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:bg-gray-50"
                >
                  <span className="sr-only">Next products</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {products.length === 0 ? (
            <div className="mx-auto mt-8 max-w-2xl py-16 text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto h-24 w-24 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-gray-900">
                No Products Available
              </h3>
              <p className="mb-8 text-lg text-gray-600">
                We're currently updating our product catalog with new sustainable items. 
                Check back soon to explore our collection of eco-friendly products crafted from recycled materials.
              </p>
              <Link
                href="/home"
                className="inline-flex items-center gap-2 rounded-full bg-[#008a6c] px-6 py-3 text-white transition hover:bg-[#00785d]"
              >
                <span>Return to Home</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="mt-8 rounded-[32px] border border-[#dfeee2] bg-[#f5fbf4] p-6 shadow-[0_25px_60px_rgba(26,77,46,0.08)]">
              <div ref={sliderRef} className="slider-scroll overflow-hidden">
                <div className="flex gap-6 py-2 pr-6">
                  {products.map((product) => (
                    <article
                      key={product._id || product.id}
                      className="flex w-[320px] flex-shrink-0 flex-col rounded-[30px] border border-[#e3efe4] bg-white px-4 pb-5 pt-4 shadow-[0_15px_30px_rgba(26,77,46,0.08)] transition hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(26,77,46,0.12)] md:w-[340px]"
                    >
                    <div className="relative flex h-64 items-center justify-center rounded-[22px] bg-[#f1f8f2] p-5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-auto object-contain"
                      />
                      {product.tag && (
                        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600 shadow">
                          {product.tag}
                        </span>
                      )}
                      {product.badge && (
                        <span className="absolute right-4 top-4 rounded-full bg-[#fef0f0] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-red-500">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
                      <div>
                        <p className="text-base font-semibold text-gray-900">{product.name}</p>
                        {product.variant && <p className="text-xs text-gray-500">{product.variant}</p>}
                      </div>
                      <p className="font-semibold text-gray-900">{product.price}</p>
                    </div>

                    {product.detailLabel && product.detailValue && (
                      <div className="mt-4 text-xs text-gray-500">
                        <p className="font-semibold text-gray-600">{product.detailLabel}</p>
                        <p>{product.detailValue}</p>
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      {renderStars(product.rating)}
                      <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>

                    <Link
                      href={`/checkout?id=${product._id || product.id}&name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}`}
                      className="mt-6 block w-full rounded-full bg-[#008a6c] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#00785d]"
                    >
                      Buy Now
                    </Link>
                  </article>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .slider-scroll {
          scrollbar-width: none;
        }
        .slider-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;

