import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import ClientsBanner from "@/components/ClientsBanner";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <FeaturedProducts />
    <WhyChooseUs />
    <ClientsBanner />
    <Footer />
  </div>
);

export default Index;
