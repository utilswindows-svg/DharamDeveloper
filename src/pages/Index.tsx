import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import ClientsBanner from "@/components/ClientsBanner";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => (
  <div className="min-h-screen">
      <SEO title="Professional Windows Utility Tools" description="Trusted by 1M+ users — data recovery, email migration, PDF management, and PC optimization tools for Windows." path="/" keywords="windows utilities, data recovery, email migration, PDF tools, PC optimization" type="website" />
    <Navbar />
    <HeroSection />
    <FeaturedProducts />
    <WhyChooseUs />
    <ClientsBanner />
    <Footer />
  </div>
);

export default Index;
