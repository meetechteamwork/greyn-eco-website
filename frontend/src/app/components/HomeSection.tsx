// 'use client';

// import React, { useCallback } from 'react';
// import Link from 'next/link';

// const HomeSection: React.FC = React.memo(() => {
//   const scrollToAbout = useCallback(() => {
//     const aboutSection = document.getElementById('about');
//     if (aboutSection) {
//       aboutSection.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, []);

//   return (
//     <section
//       id="home"
//       className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
//       role="banner"
//       aria-label="Home section"
//     >
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//         style={{
//           backgroundImage: "url('https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=2074&auto=format&fit=crop')",
//         }}
//         aria-hidden="true"
//       >
//         {/* Dark Overlay */}
//         <div className="absolute inset-0 bg-black/50"></div>
//       </div>

//       {/* Content */}
//       <div className="relative z-10 mx-auto max-w-5xl px-6 text-center animate-fade-in">
//         <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl animate-slide-up">
//           Empowering Sustainable Change
//         </h1>
//         <p className="mb-4 text-lg text-gray-200 md:text-xl lg:text-2xl animate-slide-up-delay">
//           Greyn is a sustainability-driven micro-investment platform that empowers individuals to
//           support high-impact environmental projects while earning meaningful financial returns.
//         </p>
//         <p className="mb-8 text-base text-gray-300 md:text-lg lg:text-xl animate-slide-up-delay">
//           We connect conscious investors with verified green initiatives across renewable energy,
//           clean transportation, ocean conservation, and sustainable urban development.
//         </p>
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delay-2">
//           <Link
//             href="/auth"
//             className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-semibold text-green-700 transition-all duration-300 hover:bg-green-50 hover:shadow-2xl"
//             aria-label="Get started with Greyn Eco"
//           >
//             <span className="relative z-10 flex items-center gap-2">
//               Get Started
//               <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
//                 <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
//               </svg>
//             </span>
//           </Link>
//           <button
//             onClick={scrollToAbout}
//             className="group relative overflow-hidden rounded-full bg-green-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-green-700 hover:shadow-2xl border-2 border-transparent hover:border-white"
//             aria-label="Learn more about our mission"
//           >
//             <span className="relative z-10">Learn More</span>
//             <span className="absolute inset-0 -z-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
//           </button>
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
//         <svg
//           className="h-8 w-8 text-white opacity-75"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           aria-hidden="true"
//         >
//           <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
//         </svg>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }

//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-fade-in {
//           animation: fadeIn 1s ease-out;
//         }

//         .animate-slide-up {
//           animation: slideUp 0.8s ease-out 0.2s both;
//         }

//         .animate-slide-up-delay {
//           animation: slideUp 0.8s ease-out 0.4s both;
//         }

//         .animate-slide-up-delay-2 {
//           animation: slideUp 0.8s ease-out 0.6s both;
//         }

//         @keyframes bounce {
//           0%, 100% {
//             transform: translateX(-50%) translateY(-25%);
//             animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
//           }
//           50% {
//             transform: translateX(-50%) translateY(0);
//             animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
//           }
//         }

//         .animate-bounce {
//           animation: bounce 2s infinite;
//         }
//       `}</style>
//     </section>
//   );
// });

// HomeSection.displayName = 'HomeSection';

// export default HomeSection;
"use client';"

import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const ImpactSection = React.memo(() => {
  return (
   
<>
      {/* Hero Section */}
      <section  className="relative flex min-h-screen items-center md:p-16">
        {/* Full-Page Background Image with "Framed" Aesthetic */}
        <div className="absolute w-full inset-1 overflow-hidden ">
          <img
            src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=2074&auto=format&fit=crop"
            alt="Lush green garden"
            className="h-full w-full object-cover"
          />
          {/* Enhanced Overlay Gradient for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/50 to-transparent rounded-2xl"></div>
        </div>

       
        <div className="relative z-10 mx-auto w-full">
          <div className="w-full">

            {/* Main Hero Content Card */}
            <div className="md:rounded-4xl bg-emerald-950/20 p-16 md:p-8 backdrop-blur-xs lg:py-16 shadow-xl">
              <span className="inline-block px-4 py-1.5 mb-8 text-xs font-bold tracking-widest text-[#9FEF5C] uppercase bg-white/5 border border-white/10">
                Go Green Initiative
              </span>

              <h1 className="mb-8 text-5xl font-extrabold leading-[1.05] text-white md:text-7xl">
                Growing Your Garden For Future with <span className="text-[#9FEF5C]">Greyn</span>
              </h1>

              <p className="mb-10 max-w-xl text-lg text-white/80 leading-relaxed md:text-xl">
                Let GardenGlory be your guide to building and maintaining a beautiful, healthy garden through sustainable solutions and handpicked organic essentials.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button className="group flex items-center gap-3 rounded-3xl bg-[#6BAE32] px-6 py-4 font-bold text-white transition-all hover:bg-[#5a9429] hover:scale-105 hover:shadow-[0_0_40px_rgba(107,174,50,0.5)]">
                  Join The Movement
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#6BAE32] transition-transform group-hover:translate-x-1">
                    <ArrowRight size={14} />
                  </div>
                </button>

                <div className="flex items-center gap-2 text-white/90">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-emerald-900 bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-900">
                        U{i}
                      </div>
                    ))}
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-bold">5k+ Trusted Clients</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-tighter">Verified Organic</p>
                  </div>
                </div>
              </div>

              {/* Minimalist Feature Badges */}
              <div className="mt-14 flex flex-wrap gap-3">
                {['Organic Seed', 'Soil Testing', 'Eco Friendly', 'Expert Advice'].map(tag => (
                  <span key={tag} className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 border border-white/10 text-xs font-bold text-white uppercase tracking-wider transition-colors hover:bg-white/10">
                    <CheckCircle2 size={14} className="text-[#9FEF5C]" /> {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
          <div className="h-12 w-[1px] bg-gradient-to-b from-white/40 to-transparent"></div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] [writing-mode:vertical-lr]">Scroll</p>
        </div>
      </section>
</>

   
  );
});


export default ImpactSection;