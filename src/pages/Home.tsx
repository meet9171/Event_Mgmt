import React, { useEffect } from 'react'
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { FeaturesGrid } from '../components/FeaturesGrid';
import { StatsBar } from '../components/StatsBar';
import { ProcessTimeline } from '../components/ProcessTimeline';
import { SocialProof } from '../components/SocialProof';
import { AIFeatures } from '../components/AIFeatures';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';

export default function Home() {
    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
    
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
              }
            });
          },
          { threshold: 0.1 }
        );
    
        document.querySelectorAll('section').forEach((section) => {
          observer.observe(section);
        });
    
        return () => observer.disconnect();
      }, []);
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <StatsBar />
      <ProcessTimeline />
      <SocialProof />
      <AIFeatures />
      <FinalCTA />
      <Footer />
    </main>
  )
}
