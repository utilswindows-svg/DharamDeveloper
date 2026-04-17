import { motion } from "framer-motion";
import { Building2, Award, Globe2, Users } from "lucide-react";

const clients = [
  "Microsoft", "IBM", "Oracle", "Accenture", "Deloitte", "HP",
  "Cisco", "Intel", "Samsung", "Sony", "Dell", "Lenovo",
];

const stats = [
  { icon: Users, value: "1M+", label: "Active Users" },
  { icon: Building2, value: "50K+", label: "Enterprises" },
  { icon: Globe2, value: "180+", label: "Countries" },
  { icon: Award, value: "15+", label: "Years Trusted" },
];

const ClientsBanner = () => {
  return (
    <section className="relative overflow-hidden bg-hero py-20">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
            Our Clients
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-hero-foreground mb-3">
            Trusted by Industry Leaders Worldwide
          </h2>
          <p className="text-hero-muted max-w-2xl mx-auto">
            Join thousands of organizations that rely on WindowsUtils for mission-critical data operations.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-hero-foreground/10 bg-hero-foreground/5 backdrop-blur-sm p-6 text-center hover:bg-hero-foreground/10 transition-colors"
              >
                <Icon className="h-6 w-6 text-accent mx-auto mb-3" />
                <div className="text-3xl font-bold font-heading text-hero-foreground mb-1">{s.value}</div>
                <div className="text-xs text-hero-muted uppercase tracking-wider">{s.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Client logos marquee */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-hero to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-hero to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <div className="flex gap-4 animate-[marquee_30s_linear_infinite]">
              {[...clients, ...clients].map((name, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 flex items-center justify-center px-8 py-4 rounded-xl border border-hero-foreground/10 bg-hero-foreground/5 backdrop-blur-sm min-w-[180px] hover:bg-hero-foreground/10 transition-colors"
                >
                  <span className="text-lg font-bold font-heading text-hero-foreground/80 tracking-tight">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default ClientsBanner;
