import SEO from '../components/SEO';
import HeroSection from '../sections/HeroSection';
import StatsSection from '../sections/StatsSection';
import ServicesSection from '../sections/ServicesSection';
import ProcessSection from '../sections/ProcessSection';
import FeaturedProjectsSection from '../sections/FeaturedProjectsSection';
import WhyChooseSection from '../sections/WhyChooseSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import CtaSection from '../sections/CtaSection';

export default function HomePage() {
  return (
    <>
      <SEO
        title="Professional Web Development"
        description="Building digital experiences that drive results. Fast, scalable and modern websites and web applications for businesses and startups."
        path="/"
      />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ProcessSection />
      <FeaturedProjectsSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
