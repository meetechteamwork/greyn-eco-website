'use client';

import React, { useState } from 'react';
import { Leaf, ArrowRight, Eye, Info } from 'lucide-react';
import Link from 'next/link';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  description: string;
  span?: string; // For bento grid layout
}

const GallerySection: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      alt: 'Lush green forest with sunlight filtering through trees',
      title: 'Forest Conservation',
      category: 'Ecosystem',
      description: 'Protecting vital lung-spaces and native wildlife habitats through active reforestation.',
      span: 'lg:col-span-2 lg:row-span-2'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80',
      alt: 'Solar panels array in sustainable energy farm',
      title: 'Solar Energy',
      category: 'Renewables',
      description: 'Harnessing the sun to power communities with clean, infinite energy grids.'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80',
      alt: 'Wind turbines generating clean renewable energy',
      title: 'Wind Power',
      category: 'Renewables',
      description: 'Generating high-efficiency power through strategic coastal and highland turbine arrays.'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
      alt: 'Crystal clear water flowing in natural stream',
      title: 'Water Conservation',
      category: 'Ecosystem',
      description: 'Restoring natural waterways and implementing advanced gray-water recycling systems.'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
      alt: 'Sustainable urban green building with vegetation',
      title: 'Green Architecture',
      category: 'Urban',
      description: 'Integrating living flora into vertical cityscapes for natural cooling and air purification.'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
      alt: 'Mountain landscape with pristine natural environment',
      title: 'Natural Preservation',
      category: 'Ecosystem',
      description: 'Maintaining pristine wilderness corridors to ensure species migration and genetic diversity.',
      span: 'lg:col-span-2'
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
      alt: 'Misty forest valley with ecological biodiversity',
      title: 'Biodiversity',
      category: 'Ecosystem',
      description: 'Cataloging and protecting rare floral species within sensitive ecological zones.'
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80',
      alt: 'Tranquil lake reflecting surrounding nature',
      title: 'Ecosystem Balance',
      category: 'Ecosystem',
      description: 'Balancing aquatic life cycles through sustainable management and pollution prevention.'
    }
  ];

  return (
    <section
      id="gallery"
      className="relative w-full bg-slate-50 px-6 py-24 md:py-32 overflow-hidden"
      aria-label="Gallery of sustainable projects"
    >
      {/* Decorative Background Blur */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-100 rounded-full blur-[120px] opacity-60 -translate-x-1/2 -translate-y-1/2" />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-6">
            <Leaf className="w-4 h-4" />
            <span className="uppercase tracking-widest">Global Portfolio</span>
          </div>
          <h2 className="mb-6 text-4xl font-black text-slate-900 md:text-6xl tracking-tight">
            Our Projects <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Gallery</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 font-medium">
            Explore our portfolio of sustainable initiatives and eco-friendly projects
            making a measurable difference across the globe.
          </p>
        </div>

        {/* Bento-style Gallery Grid */}
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[300px]"
          role="list"
        >
          {galleryImages.map((image) => (
            <article
              key={image.id}
              className={`group relative overflow-hidden rounded-[2.5rem] shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-900/10 ${image.span || ''}`}
              role="listitem"
              onMouseEnter={() => setHoveredId(image.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image with subtle zoom */}
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Category Badge - Always Visible */}
              <div className="absolute top-6 left-6 z-20">
                <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-xs font-black uppercase tracking-widest text-slate-900 shadow-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                  {image.category}
                </span>
              </div>

              {/* Status Indicator (Pulse) */}
              <div className="absolute top-7 right-7 z-20 flex items-center space-x-2 bg-slate-900/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Live Impact</span>
              </div>

              {/* Glassmorphism Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Content Reveal */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white translate-y-8 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
               

                <h3 className="text-2xl font-black mb-3 leading-tight">
                  {image.title}
                </h3>

                <p className="text-sm text-slate-300 mb-6 leading-relaxed line-clamp-3">
                  {image.description}
                </p>

                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-sm font-bold text-green-400 hover:text-green-300 transition-colors">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="h-4 w-[1px] bg-white/20" />
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Sophisticated CTA */}
        <div className="mt-20 text-center">
          <button className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-slate-900 rounded-full hover:bg-green-600 hover:shadow-2xl hover:shadow-green-600/30 overflow-hidden">
            <Link 
            href="/projects"
            className="relative z-10 flex items-center space-x-3">
              <span>Explore All Initiatives</span>
              {/* <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" /> */}
            </Link>
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine" />
          </button>

          <p className="mt-6 text-slate-400 text-sm font-medium">
            Over <span className="text-green-600 font-bold">1,200+</span> hectares preserved to date
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
        .animate-shine {
          animation: shine 0.7s;
        }
      `}</style>
    </section>
  );
};

export default GallerySection;