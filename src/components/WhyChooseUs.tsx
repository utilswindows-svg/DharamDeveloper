import { motion } from "framer-motion";
import { Shield, Headphones, Download, Award } from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "100% Secure",
    desc: "All our tools are malware-free and digitally signed. Your data stays private and protected.",
  },
  {
    icon: Download,
    title: "Free Trial Available",
    desc: "Try before you buy. Every tool comes with a free trial so you can evaluate it risk-free.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Our expert support team is available around the clock to help you with any issues.",
  },
  {
    icon: Award,
    title: "Trusted by Millions",
    desc: "Over 1 million users worldwide trust WindowsUtils for their data management needs.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="section-container">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Why Us</span>
          <h2 className="mt-3 text-3xl font-extrabold font-heading text-foreground sm:text-4xl">
            Why Choose WindowsUtils
          </h2>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl primary-gradient text-primary-foreground">
                <r.icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold font-heading text-foreground">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
