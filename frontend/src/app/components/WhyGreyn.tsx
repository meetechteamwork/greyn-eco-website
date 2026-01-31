"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
     ShieldCheck,
     Users,
     Globe,
     TrendingUp,
     CheckCircle2,
     ExternalLink,
     Leaf
} from 'lucide-react';

/**
 * AnimatedCounter Component
 * Uses an Intersection Observer to start the count-up animation
 * only when the element becomes visible in the viewport.
 */
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
     const [count, setCount] = useState(0);
     const countRef = useRef<HTMLSpanElement>(null);
     const [hasAnimated, setHasAnimated] = useState(false);

     useEffect(() => {
          const observer = new IntersectionObserver(
               ([entry]) => {
                    if (entry.isIntersecting && !hasAnimated) {
                         let startTimestamp: number | null = null;
                         const step = (timestamp: number) => {
                              if (!startTimestamp) startTimestamp = timestamp;
                              const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                              setCount(Math.floor(progress * end));
                              if (progress < 1) {
                                   window.requestAnimationFrame(step);
                              }
                         };
                         window.requestAnimationFrame(step);
                         setHasAnimated(true);
                    }
               },
               { threshold: 0.1 }
          );

          if (countRef.current) observer.observe(countRef.current);
          return () => observer.disconnect();
     }, [end, duration, hasAnimated]);

     return (
          <span ref={countRef} className="tabular-nums">
               {count}{suffix}
          </span>
     );
};

const WhyGreynMatters = () => {
     const features = [
          {
               icon: ShieldCheck,
               text: "Verified High-Impact Projects",
               desc: "Rigorous vetting process ensuring every initiative meets global sustainability standards.",
               color: "emerald"
          },
          {
               icon: Users,
               text: "Community Driven Action",
               desc: "Harnessing collective power to drive systemic change across local ecosystems.",
               color: "green"
          },
          {
               icon: Globe,
               text: "Circular Green Economy",
               desc: "Supporting business models that prioritize regeneration and zero-waste lifecycles.",
               color: "teal"
          },
          {
               icon: TrendingUp,
               text: "Measurable Growth",
               desc: "Real-time dashboard tracking the direct environmental ROI of your contributions.",
               color: "lime"
          }
     ];

     return (
          <section className="relative pb-24 bg-white overflow-hidden" aria-label="Core Values">
               {/* Decorative Background Elements */}
               <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-green-50 rounded-full blur-3xl opacity-50" />
               <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-50" />

               <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-center">

                         {/* Content Column */}
                         <div className="lg:col-span-7">
                              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-6">
                                   <Leaf className="w-4 h-4" />
                                   <span className="uppercase tracking-wider">Our Impact</span>
                              </div>

                              <h3 className="text-4xl md:text-5xl font-black mb-8 text-slate-900 tracking-tight leading-tight">
                                   Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Greyn</span> Matters
                              </h3>

                              <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-2xl font-medium">
                                   Greyn transforms environmental responsibility into a smart, impactful, and rewarding experience.
                                   We democratize sustainability, making high-stakes green progress achievable for everyone.
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                   {features.map((item, i) => (
                                        <div
                                             key={i}
                                             className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-green-900/5 hover:-translate-y-1 transition-all duration-300"
                                        >
                                             <div className={`inline-flex p-3 rounded-2xl bg-green-50 text-green-600 mb-5 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300`}>
                                                  <item.icon className="w-6 h-6" />
                                             </div>
                                             <h4 className="font-bold text-slate-900 mb-2 text-lg">{item.text}</h4>
                                             <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                   ))}
                              </div>
                         </div>

                         {/* Impact Scale Sidebar */}
                         <div className="lg:col-span-5 relative group">
                              <div className="absolute inset-0 bg-green-600 rounded-[3rem] rotate-2 scale-[1.02] opacity-10 group-hover:rotate-1 transition-transform duration-500" />

                              <div className="relative bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl overflow-hidden border border-slate-800">
                                   <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/20 blur-[80px]" />
                                   <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/20 blur-[80px]" />

                                   <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-16">
                                             <div>
                                                  <h4 className="text-2xl font-bold mb-1">Impact Scale</h4>
                                                  <p className="text-slate-400 text-sm">Real-time ecosystem metrics</p>
                                             </div>
                                             <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                                                  <TrendingUp className="w-6 h-6 text-green-400" />
                                             </div>
                                        </div>

                                        <div className="space-y-12">
                                             {/* Metric 1 */}
                                             <div className="group/metric">
                                                  <div className="flex justify-between items-end mb-4">
                                                       <div>
                                                            <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-1">Global Reach</p>
                                                            <h5 className="text-slate-200 font-semibold">Green Projects</h5>
                                                       </div>
                                                       <div className="text-right">
                                                            <div className="flex items-center text-4xl font-black text-white">
                                                                 <AnimatedCounter end={500} suffix="+" />
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-[2px]">
                                                       <div
                                                            className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-[1500ms] ease-out"
                                                            style={{ width: '75%' }}
                                                       />
                                                  </div>
                                             </div>

                                             {/* Metric 2 */}
                                             <div className="group/metric">
                                                  <div className="flex justify-between items-end mb-4">
                                                       <div>
                                                            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Network Power</p>
                                                            <h5 className="text-slate-200 font-semibold">Active Investors</h5>
                                                       </div>
                                                       <div className="text-right">
                                                            <div className="flex items-center text-4xl font-black text-white">
                                                                 <AnimatedCounter end={12} suffix="k" />
                                                            </div>
                                                       </div>
                                                  </div>
                                                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-[2px]">
                                                       <div
                                                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-[2000ms] ease-out delay-300"
                                                            style={{ width: '90%' }}
                                                       />
                                                  </div>
                                             </div>

                                             <div className="pt-10">
                                                  <button className="relative w-full overflow-hidden group/btn px-6 py-5 bg-white text-slate-900 rounded-2xl font-bold transition-all duration-300 hover:bg-green-500 hover:text-white flex items-center justify-center space-x-3 shadow-xl shadow-black/20">
                                                       <span className="relative z-10">View Full Impact Audit</span>
                                                       <ExternalLink className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                                  </button>

                                                  <div className="mt-6 flex items-center justify-center space-x-4 text-slate-400 text-xs font-medium uppercase tracking-tighter">
                                                       <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1 text-green-500" /> Third-party verified</span>
                                                       <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                                       <span>Updated 2h ago</span>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>

                    </div>
               </div>
          </section>
     );
};

export default WhyGreynMatters;