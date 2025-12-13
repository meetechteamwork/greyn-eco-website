'use client';

import React from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
}

const GallerySection: React.FC = React.memo(() => {
  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      alt: 'Lush green forest with sunlight filtering through trees',
      title: 'Forest Conservation'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80',
      alt: 'Solar panels array in sustainable energy farm',
      title: 'Solar Energy'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80',
      alt: 'Wind turbines generating clean renewable energy',
      title: 'Wind Power'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
      alt: 'Crystal clear water flowing in natural stream',
      title: 'Water Conservation'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
      alt: 'Sustainable urban green building with vegetation',
      title: 'Green Architecture'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
      alt: 'Mountain landscape with pristine natural environment',
      title: 'Natural Preservation'
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
      alt: 'Misty forest valley with ecological biodiversity',
      title: 'Biodiversity'
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80',
      alt: 'Tranquil lake reflecting surrounding nature',
      title: 'Ecosystem Balance'
    },
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
      alt: 'Sunset over sustainable landscape with green fields',
      title: 'Sustainable Future'
    }
  ];

  return (
    <section
      id="gallery"
      className="w-full bg-white px-6 py-20 md:py-28"
      aria-label="Gallery of sustainable projects"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Our Projects Gallery
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Explore our portfolio of sustainable initiatives and eco-friendly projects 
            making a real difference around the world.
          </p>
        </div>

        {/* Gallery Grid */}
        <div 
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
          role="list"
          aria-label="Gallery images"
        >
          {galleryImages.map((image, index) => (
            <article
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-2xl"
              role="listitem"
            >
              {/* Image Container */}
              <div className="relative h-full w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  quality={85}
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="text-xl font-bold">{image.title}</h3>
                    <p className="mt-2 text-sm text-gray-200">View Project</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <button
            className="rounded-full bg-green-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-green-700 hover:shadow-lg"
            aria-label="View all projects"
          >
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
});

GallerySection.displayName = 'GallerySection';

export default GallerySection;

