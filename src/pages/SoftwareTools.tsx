import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Mail, ShieldCheck, Star, Download } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "@/components/SEO";

interface ToolItem {
  slug: string;
  name: string;
  tagline: string;
  rating: number;
  reviews: number;
  startingPrice: number;
  icon: any;
}

interface ToolCategory {
  key: string;
  title: string;
  description: string;
  accent: string;
  items: ToolItem[];
}

const categories: ToolCategory[] = [
  {
    key: "pdf-tools",
    title: "PDF Tools",
    description:
      "Professional PDF utilities to unlock, convert, merge and manage your PDF documents with ease.",
    accent: "from-rose-500/15 to-rose-500/5 text-rose-500 border-rose-500/20",
    items: [
      {
        slug: "pdf-tools",
        name: "PDF Unlocker",
        tagline: "Remove PDF restrictions and password protection instantly.",
        rating: 4.9,
        reviews: 1240,
        startingPrice: 29,
        icon: FileText,
      },
    ],
  },
  {
    key: "email-backup",
    title: "Email Backup Tools",
    description:
      "Backup, migrate and convert email mailbox files to portable formats without losing a single message.",
    accent: "from-blue-500/15 to-blue-500/5 text-blue-500 border-blue-500/20",
    items: [
      {
        slug: "mbox-to-pdf",
        name: "MBox to PDF",
        tagline: "Convert MBOX mailbox files to PDF with attachments preserved.",
        rating: 4.8,
        reviews: 980,
        startingPrice: 29,
        icon: Mail,
      },
    ],
  },
];

const SoftwareTools: React.FC = () => {
  const total = categories.reduce((s, c) => s + c.items.length, 0);

  return (
    <div className="min-h-screen">
      <SEO
        title="All Software Tools — WindowsUtils Catalog"
        description="Browse the complete WindowsUtils software catalog. PDF tools and email backup utilities built for Windows users."
        path="/software/tools"
        keywords="windows software, pdf unlocker, mbox to pdf, email backup tools"
        type="website"
      />
      <Navbar />

      {/* Hero */}
      <section className="bg-hero text-hero-foreground py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Software Catalog
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-4">
              All Software Tools
            </h1>
            <p className="text-lg text-hero-muted">
              Explore {total} professional Windows utilities across {categories.length} categories — built to simplify your workflow and protect your data.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-hero-muted">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" /> 100% Safe & Secure
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 text-accent" /> Trusted by 1M+ users
              </span>
              <span className="inline-flex items-center gap-2">
                <Download className="h-4 w-4 text-accent" /> Free trial available
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category sections */}
      <section className="py-16 bg-background">
        <div className="section-container space-y-16">
          {categories.map((cat) => (
            <div key={cat.key}>
              <div className="mb-8 max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
                  {cat.title}
                </h2>
                <p className="mt-2 text-muted-foreground">{cat.description}</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cat.items.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <motion.div
                      key={p.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <Link
                        to={`/products/${p.slug}`}
                        className={`group flex h-full flex-col rounded-2xl border bg-card p-6 card-hover bg-gradient-to-br ${cat.accent}`}
                      >
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-card shadow-sm">
                          <Icon className="h-7 w-7" />
                        </div>
                        <h3 className="text-lg font-bold font-heading text-foreground">
                          {p.name}
                        </h3>
                        <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                          {p.tagline}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-foreground">{p.rating}</span>
                          <span>({p.reviews.toLocaleString()} reviews)</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                          <span className="text-sm">
                            <span className="text-muted-foreground">From </span>
                            <span className="font-bold text-foreground">${p.startingPrice}</span>
                          </span>
                          <span className="flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                            View Details <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SoftwareTools;