import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, HardDrive, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const categories = [
  { icon: HardDrive, label: "Data Recovery", color: "bg-primary" },
  { icon: FileText, label: "PDF Tools", color: "accent-gradient" },
  { icon: Zap, label: "Email Migration", color: "bg-success" },
  { icon: Shield, label: "PC Optimizer", color: "bg-teal" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" width={1920} height={800} />
        <div className="absolute inset-0 hero-gradient opacity-90" />
      </div>

      <div className="relative section-container py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl font-extrabold leading-tight text-hero-foreground font-heading sm:text-5xl lg:text-6xl">
            Your Trusted
            <br />
            <span className="text-accent">Windows Utility</span>
            <br />
            Toolkit
          </h1>
          <p className="mt-5 max-w-lg text-lg text-hero-muted">
            Professional-grade tools for data recovery, email migration, PDF management, and PC optimization. Trusted by 1M+ users worldwide.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/support" className="accent-gradient inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90 hover:shadow-xl">
              Explore Tools <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/help" className="inline-flex items-center gap-2 rounded-lg border border-hero-muted/30 bg-hero-foreground/5 px-6 py-3 text-sm font-semibold text-hero-foreground backdrop-blur-sm transition-all hover:bg-hero-foreground/10">
              Help Center
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-14 flex flex-wrap gap-12"
        >
          {[
            { value: "50+", label: "Utility Tools" },
            { value: "1M+", label: "Happy Users" },
            { value: "10+", label: "Years Experience" },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-3xl font-extrabold text-accent font-heading">{stat.value}</p>
              <p className="text-sm text-hero-muted">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {categories.map(cat => (
            <div key={cat.label} className={`flex items-center gap-3 rounded-xl ${cat.color} px-5 py-4 text-primary-foreground`}>
              <cat.icon className="h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold">{cat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
