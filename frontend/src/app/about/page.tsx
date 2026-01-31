// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import Header from '../components/Header';
// import Footer from '../components/Footer';

// const AboutPage: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       <Header />

//       <main className="px-6 py-20 md:py-28">
//         <div className="mx-auto max-w-4xl">
//           {/* Hero Section */}
//           <div className="mb-16 text-center">
//             <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
//               About Greyn Eco
//             </h1>
//             <p className="mx-auto max-w-2xl text-lg text-gray-600">
//               Connecting investors, NGOs, and corporations to create a sustainable future together
//             </p>
//           </div>

//           {/* Mission Section */}
//           <section className="mb-16">
//             <div className="rounded-2xl bg-white p-8 shadow-xl">
//               <h2 className="mb-4 text-3xl font-bold text-gray-900">Our Mission</h2>
//               <p className="mb-4 text-lg text-gray-700">
//                 Greyn Eco is a revolutionary platform that bridges the gap between environmental 
//                 action and financial opportunity. We believe that sustainability and profitability 
//                 can go hand in hand.
//               </p>
//               <p className="text-lg text-gray-700">
//                 Our mission is to democratize access to environmental investments, empower NGOs 
//                 to scale their impact, and help corporations achieve their ESG goals while 
//                 creating real, measurable change for our planet.
//               </p>
//             </div>
//           </section>

//           {/* Values Section */}
//           <section className="mb-16">
//             <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Our Core Values</h2>
//             <div className="grid gap-6 md:grid-cols-3">
//               <div className="rounded-xl bg-green-50 p-6 text-center">
//                 <div className="mb-4 text-4xl">🌱</div>
//                 <h3 className="mb-2 text-xl font-bold text-gray-900">Sustainability</h3>
//                 <p className="text-gray-600">
//                   Every action we take is measured by its environmental impact
//                 </p>
//               </div>
//               <div className="rounded-xl bg-blue-50 p-6 text-center">
//                 <div className="mb-4 text-4xl">🤝</div>
//                 <h3 className="mb-2 text-xl font-bold text-gray-900">Transparency</h3>
//                 <p className="text-gray-600">
//                   Complete visibility into projects, funding, and impact metrics
//                 </p>
//               </div>
//               <div className="rounded-xl bg-emerald-50 p-6 text-center">
//                 <div className="mb-4 text-4xl">💡</div>
//                 <h3 className="mb-2 text-xl font-bold text-gray-900">Innovation</h3>
//                 <p className="text-gray-600">
//                   Leveraging technology to solve the world's environmental challenges
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* How We Work Section */}
//           <section className="mb-16">
//             <div className="rounded-2xl bg-white p-8 shadow-xl">
//               <h2 className="mb-6 text-3xl font-bold text-gray-900">How We Work</h2>
//               <div className="space-y-4 text-lg text-gray-700">
//                 <p>
//                   <strong className="text-green-600">For Investors:</strong> Browse verified 
//                   environmental projects, invest in causes you care about, and earn returns 
//                   while making a positive impact.
//                 </p>
//                 <p>
//                   <strong className="text-emerald-600">For NGOs:</strong> Launch your 
//                   environmental projects, receive funding from a global community of investors, 
//                   and scale your impact with our comprehensive project management tools.
//                 </p>
//                 <p>
//                   <strong className="text-blue-600">For Corporations:</strong> Track your 
//                   carbon footprint, invest in offset projects, and generate comprehensive ESG 
//                   reports to meet your sustainability goals.
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* Impact Section */}
//           <section className="mb-16">
//             <div className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white shadow-xl">
//               <h2 className="mb-4 text-3xl font-bold">Our Impact</h2>
//               <div className="grid gap-6 md:grid-cols-3">
//                 <div className="text-center">
//                   <div className="mb-2 text-4xl font-bold">500+</div>
//                   <div className="text-lg opacity-90">Active Projects</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="mb-2 text-4xl font-bold">10K+</div>
//                   <div className="text-lg opacity-90">Investors</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="mb-2 text-4xl font-bold">50K+</div>
//                   <div className="text-lg opacity-90">Tons CO₂ Offset</div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* CTA Section */}

//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default AboutPage;
"use client"
import React, { useEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  Sprout,
  Flower,
  Wind,
  TrendingUp,
  ShieldCheck,
  Lightbulb,
  ArrowRight,
  Globe,
  BarChart3,
  ChevronRight,
  Target,
  Zap,
  Link
} from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';
/**
 * UI/UX DESIGN RATIONALE:
 * 1. Narrative Flow: Sections are spaced to allow the eye to rest, preventing information overload.
 * 2. Visual Hierarchy: Using size and color weight (Emerald vs Slate) to guide the user's focus.
 * 3. Interaction Design: Micro-interactions on buttons and cards provide tactile feedback.
 * 4. Inclusivity: High color contrast and reduced motion support.
 */

const EcoBackground = () => {
  const shouldReduceMotion = useReducedMotion();
  const iconData = useMemo(() => [
    { Icon: Leaf, x: 5, y: 15, d: 22, s: 30 },
    { Icon: Sprout, x: 85, y: 10, d: 28, s: 45 },
    { Icon: Flower, x: 50, y: 75, d: 20, s: 35 },
    { Icon: Wind, x: 20, y: 85, d: 32, s: 40 },
  ], []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fafaf9] dark:bg-[#09090b]">
      <motion.div
        animate={shouldReduceMotion ? {} : {
          scale: [1, 1.2, 1],
          x: [0, 40, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-emerald-100/40 dark:bg-emerald-900/10 blur-[120px]"
      />
      <motion.div
        animate={shouldReduceMotion ? {} : {
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-teal-100/30 dark:bg-teal-900/10 blur-[120px]"
      />
      {!shouldReduceMotion && iconData.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.15, 0],
            y: [`${item.y}vh`, `${item.y - 5}vh`, `${item.y}vh`]
          }}
          transition={{ duration: item.d, repeat: Infinity, ease: "easeInOut" }}
          className="absolute text-emerald-900/20 dark:text-emerald-100/10 pointer-events-none"
          style={{ left: `${item.x}vw`, top: `${item.y}vh` }}
        >
          <item.Icon size={item.s} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
};

const FadeIn = ({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "down" | "left" | "right" }) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

const SectionHeader = ({ badge, title, text, centered = false }: { badge: string; title: string; text?: string; centered?: boolean }) => (
  <div className={`mb-16 ${centered ? 'text-center flex flex-col items-center' : ''}`}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 border border-emerald-200/50 dark:border-emerald-800/50 mb-6"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-300">
        {badge}
      </span>
    </motion.div>
    <h2 className={`text-4xl md:text-6xl font-serif text-green-800 dark:text-white font-medium mb-6 leading-[1.1] ${centered ? 'max-w-3xl' : ''}`}>
      {title}
    </h2>
    {text && <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">{text}</p>}
  </div>
);

const App = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen font-sans text-slate-900 dark:text-slate-100 selection:bg-emerald-200 selection:text-emerald-900">
      <EcoBackground />

      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-32">

        {/* Hero Section */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center text-center mb-24">
          <FadeIn>
            <h1 className="text-6xl md:text-9xl font-serif font-medium tracking-tight mb-8">
              The Future is <br />
              <span className="relative">
                <span className="relative z-10 text-emerald-600 italic">Sustainable.</span>
                <svg className="absolute -bottom-2 left-0 w-full text-emerald-200 dark:text-emerald-900/50 -z-0" viewBox="0 0 338 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9C118.5 2.5 220 2.5 335 9" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed mb-12">
              Greyn Eco is a revolutionary platform bridging the gap between environmental action and financial opportunity. We believe that impact and growth are inseparable.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex -space-x-3 overflow-hidden">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-[#fafaf9] dark:ring-zinc-950 bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                  </div>
                ))}
                <div className="flex items-center justify-center h-10 w-10 rounded-full ring-4 ring-[#fafaf9] dark:ring-zinc-950 bg-emerald-500 text-[10px] font-bold text-white">
                  10k+
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium flex items-center ml-2">Trusted by 10,000+ global eco-investors</p>
            </div>
          </FadeIn>
        </section>

        {/* Mission Statement */}
        <section className="mb-48">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 relative">
              <FadeIn direction="right">
                <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-200 aspect-[4/5] shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop"
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                    alt="Lush environment"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="text-xl font-serif italic mb-2">"Real change happens when we align our values with our capital."</p>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">— Greyn Founders</span>
                  </div>
                </div>
              </FadeIn>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-center h-full pt-12">
              <FadeIn>
                <SectionHeader
                  badge="Our Mission"
                  title="Democratizing the Green Revolution."
                  text="We are building the infrastructure for a planet-positive economy. Our goal is to empower every individual and corporation to play an active role in environmental restoration."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                      <Target size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Scale Impact</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">Helping NGOs launch and manage projects with a global funding pool.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Empower ESG</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">Enabling corporations to meet sustainability goals through verified data.</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-48">
          <SectionHeader centered badge="Principles" title="The Greyn Core Values" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sprout,
                color: "emerald",
                title: "Sustainability",
                desc: "Every action is measured by its long-term environmental footprint. We prioritize the planet in every line of code.",
                badge: "Eco-First"
              },
              {
                icon: ShieldCheck,
                color: "blue",
                title: "Transparency",
                desc: "Complete visibility into project funding and impact. We are committed to a world without greenwashing.",
                badge: "Trust"
              },
              {
                icon: Lightbulb,
                color: "amber",
                title: "Innovation",
                desc: "Leveraging the latest in climate-tech and financial systems to solve environmental challenges efficiently.",
                badge: "Future"
              }
            ].map((value, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group h-full p-10 rounded-[2rem] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10">
                  <div className={`w-14 h-14 rounded-2xl mb-8 flex items-center justify-center bg-${value.color}-50 dark:bg-${value.color}-900/20 text-${value.color}-600 dark:text-${value.color}-400 group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                    <value.icon size={28} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">{value.badge}</span>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{value.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Ecosystem Breakdown */}
        <section className="mb-48 p-8 md:p-20 rounded-[3.5rem] bg-zinc-900 dark:bg-zinc-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent)] pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <SectionHeader
                badge="The Network"
                title="A Unified Ecosystem."
                text="Three distinct pathways, one common goal: a thriving planet. We provide specialized tools for every stakeholder."
              />
              <div className="space-y-6">
                {[
                  { icon: TrendingUp, label: "Investors", text: "Verified projects with potential returns.", col: "text-emerald-400" },
                  { icon: Globe, label: "NGOs", text: "Scale impact with global community funding.", col: "text-blue-400" },
                  { icon: BarChart3, label: "Corporations", text: "Comprehensive ESG reporting and offsets.", col: "text-teal-400" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-default">
                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${item.col}`}>
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.label}</h4>
                      <p className="text-sm text-zinc-400">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/30 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-emerald-500/20 animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf size={80} className="text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                </div>
                {/* Orbital Icons */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-emerald-400"><TrendingUp size={20} /></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-blue-400"><Globe size={20} /></div>
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-teal-400"><BarChart3 size={20} /></div>
              </div>
            </div>
          </div>
        </section>

        {/* Real Impact Metrics */}
        <section className="mb-48">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { label: "Active Projects", value: "500+", sub: "Verified worldwide" },
              { label: "Global Investors", value: "10K+", sub: "In 45 countries" },
              { label: "Tons CO₂ Offset", value: "50K+", sub: "Audited reduction" }
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="relative group p-6">
                  <div className="text-7xl font-serif font-medium text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</div>
                  <div className="text-xs text-slate-500 italic">{stat.sub}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Join the Movement CTA */}
        <section className="relative overflow-hidden rounded-[3.5rem] p-12 md:p-24 text-center">
          <div className="absolute inset-0 bg-emerald-600 -z-10" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20 pointer-events-none" />

          <FadeIn>
            <h2 className="text-4xl md:text-7xl font-serif text-white mb-8 max-w-4xl mx-auto leading-tight">
              Ready to invest in the <br />
              <span className="italic">planet's future?</span>
            </h2>
            <p className="text-emerald-50 text-lg md:text-xl max-w-xl mx-auto mb-12 opacity-90">
              Start your journey today. Whether you're an individual or a corporation, there's a place for you in the Greyn Eco system.
            </p>
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-200">Join Us Today</h2>
              <p className="mb-6 text-lg text-green-200">
                Be part of the solution. Start your journey with Greyn Eco.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/how-it-works"
                  className="rounded-lg border-2 border-green-100 px-8 py-3 font-semibold text-green-100 transition-all hover:bg-green-100 hover:text-white"
                >
                  Learn How It Works
                </Link>
                <Link
                  href="/auth"
                  className="rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 px-8 py-3 font-semibold text-white transition-all hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </FadeIn>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default App;