import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Target, Globe, Award } from "lucide-react";

const values = [
  { icon: Target, title: "Mission-Driven", desc: "We build tools that solve real problems for Windows users worldwide." },
  { icon: Users, title: "Customer First", desc: "Every feature we build starts with understanding our users' needs." },
  { icon: Globe, title: "Global Reach", desc: "Our software serves customers in over 100 countries across the globe." },
  { icon: Award, title: "Quality Assured", desc: "Rigorous testing ensures every tool meets the highest standards." },
];

const About = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="hero-gradient py-20">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">About Us</span>
          <h1 className="mt-3 text-4xl font-extrabold font-heading text-hero-foreground sm:text-5xl">
            We Simplify Technology<br />for Windows Users
          </h1>
          <p className="mt-5 max-w-xl text-hero-muted text-lg">
            WindowsUtils has been building trusted software utilities for over a decade, helping millions of users recover data, migrate emails, and optimize their systems.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="py-20">
      <div className="section-container">
        <h2 className="text-3xl font-extrabold font-heading text-foreground text-center">Our Core Values</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 text-center card-hover"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl primary-gradient text-primary-foreground">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold font-heading text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-muted/50">
      <div className="section-container grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl font-extrabold font-heading text-foreground">Our Story</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Founded with a vision to make powerful Windows utilities accessible to everyone, WindowsUtils started as a small team of developers passionate about solving data challenges. Today, we offer over 50 professional tools used by individuals, businesses, and IT professionals across the globe.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Our commitment to quality, security, and customer satisfaction has earned us the trust of over 1 million users. We continue to innovate and expand our product line to meet the evolving needs of Windows users everywhere.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[
            { value: "10+", label: "Years" },
            { value: "1M+", label: "Users" },
            { value: "50+", label: "Tools" },
            { value: "100+", label: "Countries" },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-card border border-border p-6 text-center">
              <p className="text-3xl font-extrabold font-heading text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default About;
