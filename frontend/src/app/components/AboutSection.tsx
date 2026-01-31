"use client";
import React, { useState } from 'react';
import {
  Leaf,
  Target,
  Eye,
  TrendingUp,
  Users,
  Globe,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import WhyGreyn from './WhyGreyn';
import RewardingCycle from './RewardingCycle';

/**
 * REUSABLE UI COMPONENTS
 */

type SectionHeadingProps = {
  title: string;
  subtitle: string;
  centered?: boolean; // optional, defaults to false
};

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  centered = false,
}) => (

  <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
    <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-green-700 uppercase bg-green-50 rounded-2xl border border-green-100">
      {subtitle}
    </span>
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
      {title}
    </h2>
  </div>
);

// const ValueCard = ({ icon: Icon, title, description, colorClass, borderClass, lightBg }) => (
//   <div className={`p-10 rounded-[2.5rem] border ${borderClass} ${lightBg} shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden`}>
//     <div className="relative z-10">
//       <div className={`w-16 h-16 rounded-2xl ${colorClass} flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform duration-500`}>
//         <Icon className="w-8 h-8" />
//       </div>
//       <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
//       <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
//         {description}
//       </div>
//     </div>
//     <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-2xl opacity-5 group-hover:scale-150 transition-transform duration-700 ${colorClass}`} />
//   </div>
// );

const missionVision = [
  {
    id: 0,
    title: "Our Mission",
    icon: <Target size={20} />,
    desc: "Our mission is to make sustainable investing accessible to everyone by connecting individuals with verified, high-impact environmental projects. We aim to empower people to create meaningful change through small, transparent, and measurable micro-investments."
  },
  {
    id: 1,
    title: "Our Vision",
    icon: <Eye size={20} />,
    desc: "To build a world where sustainability is a natural part of everyday life—accessible, rewarding, and driven by community participation. We imagine a circular green economy where investments generate environmental impact, financial value, and digital rewards."
  }
];

/**
 * MAIN PAGE COMPONENT
 */
export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-36">
        <div className="flex flex-col items-end justify-between gap-8 lg:flex-row">
          <div className=" w-full md:w-3/4 lg:w-1/2">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#6BAE32]">
              <span className="h-[2px] w-8 bg-[#6BAE32]"></span>
              The Greyn Story
            </div>
            <h2 className="text-3xl font-bold text-[#2D4A22] lg:text-4xl">
              Redefining Sustainability Through  <span className="text-[#6BAE32] underline decoration-lime-200 underline-offset-8">Micro-Investment</span>
            </h2>
          </div>
          <div className=" w-full md:w-1/4 lg:w-1/2 text-[#2D4A22]/70">
            <p className="mb-6">At Greyn, we believe that real change begins with accessible opportunities. We've created a platform where every individual can become a catalyst for a cleaner, more resilient planet.</p>
            {/* <p>Driven by a love for nature, Greyn offers quality seeds, rich soil, essential tools, and expert gardening services—all in one place.</p> */}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-neutral-100 p-8 text-center">
              <div className="text-4xl font-bold text-[#2D4A22]">10k+</div>
              <div className="text-sm font-medium text-[#2D4A22]/60 uppercase mt-2">Global
                Active Investors</div>
            </div>
            <div className="h-64 overflow-hidden rounded-3xl">
              <img src="https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=1000&auto=format&fit=crop" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="relative h-full min-h-[400px] overflow-hidden rounded-3xl group">
              <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000&auto=format&fit=crop" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D4A22]/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between text-white">
                <div>
                  <div className="text-5xl font-bold">1M+</div>
                  <div className="text-lg opacity-80">Trees Goals</div>
                </div>
                <div className="rounded-2xl bg-[#6BAE32] p-4">
                  <ArrowRight size={24} className="-rotate-45" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-neutral-100 p-8 text-center">
              <div className="text-4xl font-bold text-[#2D4A22]">20+</div>
              <div className="text-sm font-medium text-[#2D4A22]/60 uppercase mt-2">Service Providers</div>
            </div>
            <div className="h-64 overflow-hidden rounded-3xl">
              <img src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=1000&auto=format&fit=crop" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
        {/* Mission & Vision Section */}

        <section className=" py-36" aria-label="Mission and Vision">
          <div className="mx-auto max-w-7xl ">
            <div className="mb-16 flex flex-col md:flex-row items-end justify-between">
              <div>
                <h2 className="mb-4 text-4xl font-bold text-[#2D4A22]">Purpose <span className="inline-block align-top text-[#6BAE32]">↗</span></h2>
                <p className="mb-4 md:mb-0 max-w-md text-[#2D4A22]/60">Our commitment to sustainability drives every investment and project we verify. Discover how we're shaping the future.</p>
              </div>
              <button className=" w-full md:w-auto flex items-center gap-2 rounded-2xl bg-[#6BAE32] px-6 py-3 font-bold text-white transition-all hover:bg-[#5a9429]">
                Our Values
                <ArrowRight size={18} className="rounded-2xl /20 p-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div className="overflow-hidden rounded-[3rem]">
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop"
                  alt="Sustainable Future"
                  className="h-full w-full object-cover min-h-[500px]"
                />
              </div>

              <div className="flex flex-col gap-6">
                {missionVision.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`cursor-pointer rounded-[2.5rem] p-8 transition-all duration-500 ${activeTab === item.id ? 'bg-[#2D4A22] text-white shadow-2xl scale-[1.02]' : 'bg-[#F4F9EE] text-[#2D4A22] hover:bg-[#EAF3DE]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${activeTab === item.id ? 'bg-[#6BAE32] text-white' : 'bg-[#6BAE32]/10 text-[#6BAE32]'}`}>
                          {item.icon}
                        </div>
                        <h3 className="text-2xl font-bold">{item.title}</h3>
                      </div>
                      {activeTab === item.id ? (
                        <CheckCircle2 size={24} className="text-[#9FEF5C]" />
                      ) : (
                        <ChevronRight size={24} className="text-[#6BAE32]" />
                      )}
                    </div>
                    {activeTab === item.id && (
                      <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <p className="text-lg leading-relaxed text-white/80">
                          {item.desc}
                        </p>
                        {/* <button className="mt-8 flex items-center gap-2 font-bold text-[#9FEF5C] hover:underline">
                          Learn more about our impact <ExternalLink size={16} />
                        </button> */}
                      </div>
                    )}
                  </div>
                ))}

                {/* Extra Impact Card
                <button className="mt-auto rounded-[2.5rem] border-2 border-dashed border-[#6BAE32]/30 p-8 text-center">
                  <Globe className="mx-auto mb-4 text-[#6BAE32]" size={32} />
                  <p className="text-sm font-bold uppercase tracking-widest text-[#2D4A22]/40">Join Us</p>
                
                </button> */}
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* ?/////////////////////////////////// */}
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-green-100 selection:text-green-900 overflow-x-hidden">

<WhyGreyn />

       <RewardingCycle />

      </div>
    </>
  );
}