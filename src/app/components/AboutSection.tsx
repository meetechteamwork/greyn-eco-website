'use client';

import React from 'react';
import Image from 'next/image';

const AboutSection: React.FC = React.memo(() => {
  return (
    <section
      id="about"
      className="w-full bg-white px-6 py-20 md:py-28"
      aria-label="About section"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <div className="relative h-[400px] w-full overflow-hidden rounded-2xl shadow-2xl md:h-[500px]">
            <div
              className="h-full w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070&auto=format&fit=crop')",
              }}
              role="img"
              aria-label="Sustainable green building and nature"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-transparent"></div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col justify-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              About Our Mission
            </h2>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              At <span className="font-semibold text-green-700">Greyn Eco Front</span>, 
              we believe in the power of green micro-investments to create lasting 
              environmental impact. Our vision is to make sustainability accessible 
              to everyone, one small investment at a time.
            </p>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              We connect conscious investors with eco-friendly projects that drive 
              real change—from renewable energy initiatives to sustainable urban 
              development. Every micro-investment contributes to building a greener, 
              more sustainable future for generations to come.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Through innovation, transparency, and community engagement, we're 
              revolutionizing how people think about sustainability and investment. 
              Join us in transforming the world, one green brick at a time.
            </p>
            
            {/* Stats or Key Points */}
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="rounded-lg bg-green-50 p-4">
                <h3 className="text-3xl font-bold text-green-700">500+</h3>
                <p className="text-sm text-gray-600">Green Projects</p>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <h3 className="text-3xl font-bold text-green-700">10k+</h3>
                <p className="text-sm text-gray-600">Investors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;

