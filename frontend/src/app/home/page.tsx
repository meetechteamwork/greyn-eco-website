'use client';

import Header from '../components/Header';
import HomeSection from '../components/HomeSection';
import AboutSection from '../components/AboutSection';
import ImpactSection from '../components/ImpactSection';
import GallerySection from '../components/GallerySection';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HomeSection />
      <AboutSection />
      <ImpactSection />
      <GallerySection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
