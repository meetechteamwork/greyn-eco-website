'use client';

import React from 'react';

const ImpactSection: React.FC = React.memo(() => {
  const impactCards = [
    {
      icon: '🌱',
      title: 'Micro-Investment Access',
      description: 'Start your sustainable investment journey with as little as you want. We make green investments accessible to everyone, regardless of budget size.'
    },
    {
      icon: '💧',
      title: 'Eco Impact Transparency',
      description: 'Track the real-world environmental impact of your investments. See exactly how your contributions are making a difference in carbon reduction and sustainability.'
    },
    {
      icon: '☀️',
      title: 'Community Sustainability Movement',
      description: 'Join a growing community of eco-conscious investors. Together, we create collective impact and drive meaningful change for our planet.'
    }
  ];

  return (
    <section
      id="impact"
      className="w-full bg-gradient-to-b from-gray-50 to-white px-6 py-20 md:py-28"
      aria-label="Impact section"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Our Impact
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover how we're revolutionizing sustainable investing through innovation, 
            transparency, and community engagement.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {impactCards.map((card, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Icon */}
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-5xl transition-transform duration-300 group-hover:scale-110">
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                {card.title}
              </h3>

              {/* Description */}
              <p className="leading-relaxed text-gray-600">
                {card.description}
              </p>

              {/* Decorative Element */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-green-50 opacity-50 transition-all duration-300 group-hover:scale-150"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ImpactSection.displayName = 'ImpactSection';

export default ImpactSection;

