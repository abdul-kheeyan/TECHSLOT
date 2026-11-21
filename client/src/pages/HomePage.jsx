import SEO from '../components/SEO';
import HeroSection from '../sections/HeroSection';
import ServicesSection from '../sections/ServicesSection';
import ProcessSection from '../sections/ProcessSection';
import FeaturedProjectsSection from '../sections/FeaturedProjectsSection';
import WhyChooseSection from '../sections/WhyChooseSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import FaqSection from '../sections/FaqSection';
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
      <ServicesSection />
      <ProcessSection />
      <FeaturedProjectsSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
