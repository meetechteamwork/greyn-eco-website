import React from 'react';
import {
     Recycle,
     Leaf,
     Sun,
     Home,
     Smartphone,
     Shirt,
     ChevronRight,
     ArrowRight
} from 'lucide-react';

const RewardingCycle = () => {
     const rewardCategories = [
          { name: 'Recycled Tech', icon: Smartphone, color: 'emerald' },
          { name: 'Organic Apparel', icon: Shirt, color: 'green' },
          { name: 'Solar Gears', icon: Sun, color: 'lime' },
          { name: 'Eco-Home', icon: Home, color: 'teal' }
     ];

     return (
          <section className="relative py-32 bg-slate-50 overflow-hidden" aria-label="Ecosystem">
               {/* Organic Background Shapes */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-green-100/40 to-transparent rounded-full blur-[120px] pointer-events-none" />

               <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Header Section */}
                    <div className="max-w-4xl mx-auto text-center mb-20">
                         <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-green-100 text-green-700 text-sm font-bold mb-6 shadow-sm">
                              <Recycle className="w-4 h-4 animate-spin-slow" />
                              <span className="uppercase tracking-[0.2em]">The Circular Economy</span>
                         </div>

                         <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">
                              A Rewarding Cycle <br />
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                                   of Impact
                              </span>
                         </h2>

                         <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
                              Greyn points aren't just numbers. They are the keys to a greener lifestyle.
                              Redeem your impact points for eco-friendly products crafted from recycled
                              materials, <span className="text-green-700 font-bold">closing the loop</span> on global waste.
                         </p>
                    </div>

                    {/* Circular Visualization Concept */}
                    <div className="relative max-w-5xl mx-auto">
                         {/* Main Grid */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                              {rewardCategories.map((item, i) => (
                                   <div
                                        key={item.name}
                                        className="group relative flex flex-col items-center p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-green-900/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                                   >
                                        {/* Icon Container */}
                                        <div className="relative mb-6">
                                             <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity" />
                                             <div className="relative w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                                                  <item.icon className="w-8 h-8" />
                                             </div>
                                        </div>

                                        <span className="text-lg font-bold text-slate-900 mb-2">{item.name}</span>
                                        <div className="flex items-center text-xs font-bold text-green-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                                             <span>Explore Items</span>
                                             <ChevronRight className="w-3 h-3 ml-1" />
                                        </div>

                                        {/* Decorative Dot */}
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-green-500 rounded-full scale-0 group-hover:scale-100 transition-transform" />
                                   </div>
                              ))}
                         </div>

                         {/* Connective Tissue/Ecosystem Visuals */}
                         <div className="mt-16 text-center">
                              <button className="group inline-flex items-center space-x-3 px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-green-600 transition-all duration-300 shadow-xl shadow-slate-200">
                                   <span>Enter the Rewards Marketplace</span>
                                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </button>
                         </div>
                    </div>
               </div>

               <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
          </section>
     );
};

export default RewardingCycle;