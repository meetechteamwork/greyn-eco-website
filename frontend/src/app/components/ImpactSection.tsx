'use client';

import React from 'react';
import { Leaf, Droplets, Sun, ArrowRight } from 'lucide-react';

const ImpactSection = React.memo(() => {
  const impactCards = [
    {
      icon: <Leaf className="w-8 h-8 text-emerald-600" />,
      emoji: '🌱',
      title: 'Micro-Investment Access',
      description: 'Start your sustainable investment journey with as little as you want. We make green investments accessible to everyone, regardless of budget size.'
    },
    {
      icon: <Droplets className="w-8 h-8 text-emerald-600" />,
      emoji: '💧',
      title: 'Eco Impact Transparency',
      description: 'Track the real-world environmental impact of your investments. See exactly how your contributions are making a difference in carbon reduction and sustainability.'
    },
    {
      icon: <Sun className="w-8 h-8 text-emerald-600" />,
      emoji: '☀️',
      title: 'Community Sustainability Movement',
      description: 'Join a growing community of eco-conscious investors. Together, we create collective impact and drive meaningful change for our planet.'
    }
  ];

  return (
    <section
      id="impact"
      className="relative w-full overflow-hidden bg-white px-6 py-24 md:py-32 selection:bg-emerald-100 selection:text-emerald-900"
      aria-label="Impact section"
    >
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-lime-50 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 rounded-full border border-emerald-100">
            Our Contribution
          </span>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-emerald-950 md:text-6xl">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-500">Impact</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
            Discover how we're revolutionizing sustainable investing through innovation,
            transparency, and community engagement.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {impactCards.map((card, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-start p-8 transition-all duration-500 bg-white border border-slate-100 rounded-3xl hover:border-emerald-200 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)]"
            >
              {/* Icon Container */}
              <div className="relative flex items-center justify-center w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-lime-50 group-hover:scale-110 transition-transform duration-500">
                <span className="text-3xl">{card.emoji}</span>
                {/* Minimalist leaf overlay */}
                <svg className="absolute -top-2 -right-2 w-6 h-6 text-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="mb-4 text-2xl font-bold tracking-tight text-emerald-900 group-hover:text-emerald-700 transition-colors">
                {card.title}
              </h3>

              {/* Description */}
              <p className="mb-8 text-base leading-relaxed text-slate-500 group-hover:text-slate-600 transition-colors">
                {card.description}
              </p>

              

              {/* Decorative Corner Element */}
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden rounded-tr-3xl pointer-events-none">
                <div className="absolute top-[-20%] right-[-20%] w-16 h-16 bg-lime-100/30 rounded-full group-hover:scale-[3] transition-transform duration-700 blur-xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Decorative Divider */}
        <div className="mt-20 flex justify-center items-center gap-4">
          <div className="h-px w-12 bg-emerald-100"></div>
          <div className="w-2 h-2 rounded-full bg-lime-400"></div>
          <div className="h-px w-12 bg-emerald-100"></div>
        </div>
      </div>
    </section>
  );
});

ImpactSection.displayName = 'ImpactSection';

export default ImpactSection;