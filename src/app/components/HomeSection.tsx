'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';

const HomeSection: React.FC = React.memo(() => {
  const scrollToAbout = useCallback(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      role="banner"
      aria-label="Home section"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=2074&auto=format&fit=crop')",
        }}
        aria-hidden="true"
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center animate-fade-in">
        <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl animate-slide-up">
          Building a Greener Tomorrow
        </h1>
        <p className="mb-8 text-lg text-gray-200 md:text-xl lg:text-2xl animate-slide-up-delay">
          Sustainable solutions for a better planet. Join us in creating eco-friendly 
          spaces that inspire positive change and environmental responsibility.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delay-2">
          <Link
            href="/auth"
            className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-semibold text-green-700 transition-all duration-300 hover:bg-green-50 hover:shadow-2xl"
            aria-label="Get started with Greyn Eco"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
          </Link>
          <button
            onClick={scrollToAbout}
            className="group relative overflow-hidden rounded-full bg-green-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-green-700 hover:shadow-2xl border-2 border-transparent hover:border-white"
            aria-label="Learn more about our mission"
          >
            <span className="relative z-10">Learn More</span>
            <span className="absolute inset-0 -z-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="h-8 w-8 text-white opacity-75"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out 0.2s both;
        }

        .animate-slide-up-delay {
          animation: slideUp 0.8s ease-out 0.4s both;
        }

        .animate-slide-up-delay-2 {
          animation: slideUp 0.8s ease-out 0.6s both;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateX(-50%) translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateX(-50%) translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </section>
  );
});

HomeSection.displayName = 'HomeSection';

export default HomeSection;

