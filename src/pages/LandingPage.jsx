import React, { Suspense } from 'react';

import { useFeatures } from '@/hooks/useFeatures';
import { scrollToSelector } from '@/lib/scrollToSection';
import Header from '@/components/layout/Header';
import StarField from '@/components/layout/StarField';

import HeroSection from '@/features/Hero';
import AboutUsSection from '@/features/AboutUs';

// Everything below the fold is code-split.
const FameSection = React.lazy(() => import('@/features/Fame'));
const TestimonialsSection = React.lazy(() => import('@/features/Testimonials'));
const TeamSection = React.lazy(() => import('@/features/Team'));
const MerchandiseSection = React.lazy(() => import('@/features/Merchandise'));
const FestSection = React.lazy(() => import('@/features/Fest'));
const BoardApplicationSection = React.lazy(() => import('@/features/BoardApplication'));
const DomainSelectionSection = React.lazy(() => import('@/features/DomainSelection'));
const EventsSection = React.lazy(() => import('@/features/Events'));
const PublicationsSection = React.lazy(() => import('@/features/Publications'));
const BlogsSection = React.lazy(() => import('@/features/Blogs'));
const PartnersSection = React.lazy(() => import('@/features/Partners'));
const GallerySection = React.lazy(() => import('@/features/Gallery'));
const FaqSection = React.lazy(() => import('@/features/Faq'));
const Footer = React.lazy(() => import('@/components/layout/Footer'));

export default function LandingPage() {
  const { features } = useFeatures();
  const scrollToSection = (selector) => scrollToSelector(selector);

  return (
    <div className="tg-landing">
      <StarField />

      <div className="tg-content">
        <Header />

        <HeroSection />

        <AboutUsSection scrollToSection={scrollToSection} />

        <Suspense fallback={null}>
          <FameSection />
          <TestimonialsSection />
          <TeamSection />
          <MerchandiseSection />
          <FestSection />
          {features.boardApplication && <BoardApplicationSection />}
          {features.domainSelection && <DomainSelectionSection />}
          <EventsSection />
          <PublicationsSection />
          <BlogsSection />
          <PartnersSection />
          <GallerySection />
          <FaqSection />
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}