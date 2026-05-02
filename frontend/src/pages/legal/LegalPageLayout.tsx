import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LegalPageLayout = ({ title, subtitle, lastUpdated, children }: Props) => (
  <div className="min-h-screen">
    <Navbar />
    <section className="bg-hero py-16">
      <div className="section-container text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold font-heading text-hero-foreground mb-3"
        >
          {title}
        </motion.h1>
        <p className="text-hero-muted">{subtitle}</p>
        <p className="text-hero-muted/60 text-xs mt-2">Last updated: {lastUpdated}</p>
      </div>
    </section>
    <div className="section-container py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="prose prose-sm sm:prose max-w-none text-muted-foreground 
          [&_h2]:text-foreground [&_h2]:font-heading [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-4
          [&_h3]:text-foreground [&_h3]:font-heading [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-3
          [&_ul]:space-y-1 [&_li]:text-muted-foreground [&_strong]:text-foreground
          [&_p]:leading-relaxed"
      >
        {children}
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default LegalPageLayout;
