'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

type Product = {
  id: string;
  name: string;
  variant: string;
  detailLabel: string;
  detailValue: string;
  badge: string;
  tag: string;
  price: string;
  rating: number;
  reviews: number;
  note: string;
  image: string;
};

const products: Product[] = [
  {
    id: 'eco-tiles-l',
    name: 'EcoTiles (L)',
    variant: '12 × 6 inch',
    detailLabel: 'Colors Available',
    detailValue: 'Lagoon Blue, Carbon Grey',
    badge: 'new',
    tag: 'Recycled',
    price: 'Rs. 200 / sqft',
    rating: 4.8,
    reviews: 121,
    note: 'Upcycled ocean plastic with marble finish.',
    image: 'https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'eco-pots-s',
    name: 'EcoPots (S)',
    variant: 'Hexa 5"',
    detailLabel: 'Various Sizes Available',
    detailValue: 'S / M / L',
    badge: 'hot',
    tag: 'Made by Ecobricks',
    price: 'Rs. 700',
    rating: 4.7,
    reviews: 121,
    note: 'Self-watering planter crafted from recycled HDPE.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'eco-pots-l',
    name: 'EcoPots (L)',
    variant: 'Hexa 9"',
    detailLabel: 'Various Sizes Available',
    detailValue: 'Up to 14"',
    badge: 'trending',
    tag: '100% recycled',
    price: 'Rs. 1,000',
    rating: 4.9,
    reviews: 121,
    note: 'Matte finish planter ideal for succulents & bonsai.',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'eco-brick',
    name: 'EcoBricks',
    variant: '8 × 4 inch',
    detailLabel: 'Palette Shades',
    detailValue: 'Forest, Coral, Mist',
    badge: 'bestseller',
    tag: 'Low carbon',
    price: 'Rs. 80 / brick',
    rating: 4.8,
    reviews: 94,
    note: 'Ready-to-lay structural blocks with 65% recycled fill.',
    image: 'https://images.unsplash.com/photo-1507963541651-e3b9e1de9f47?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'eco-panels',
    name: 'EcoPanels',
    variant: '24 × 24 inch',
    detailLabel: 'Finish Options',
    detailValue: 'Matte / Satin',
    badge: 'limited',
    tag: 'Zero waste',
    price: 'Rs. 950 / panel',
    rating: 4.6,
    reviews: 68,
    note: 'Modular wall panels pressed from post-consumer plastic.',
    image: 'https://images.unsplash.com/photo-1505692794400-5e0b0c18bad3?auto=format&fit=crop&w=900&q=80'
  }
];

const ProductsPage: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

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
          </div>

          <div className="mt-8 rounded-[32px] border border-[#dfeee2] bg-[#f5fbf4] p-6 shadow-[0_25px_60px_rgba(26,77,46,0.08)]">
            <div ref={sliderRef} className="hide-scrollbar overflow-hidden">
              <div className="flex gap-6 py-2 pr-6">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="flex w-[320px] flex-shrink-0 flex-col rounded-[30px] border border-[#e3efe4] bg-white px-4 pb-5 pt-4 shadow-[0_15px_30px_rgba(26,77,46,0.08)] transition hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(26,77,46,0.12)] md:w-[340px]"
                  >
                    <div className="relative flex h-64 items-center justify-center rounded-[22px] bg-[#f1f8f2] p-5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-auto object-contain"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600 shadow">
                        {product.tag}
                      </span>
                      <span className="absolute right-4 top-4 rounded-full bg-[#fef0f0] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-red-500">
                        {product.badge}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
                      <div>
                        <p className="text-base font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.variant}</p>
                      </div>
                      <p className="font-semibold text-gray-900">{product.price}</p>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                      <p className="font-semibold text-gray-600">{product.detailLabel}</p>
                      <p>{product.detailValue}</p>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      {renderStars(product.rating)}
                      <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>

                    <Link
                      href={`/products/payment?product=${product.id}&name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}`}
                      className="mt-6 block w-full rounded-full bg-[#008a6c] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#00785d]"
                    >
                      Buy Now
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;

