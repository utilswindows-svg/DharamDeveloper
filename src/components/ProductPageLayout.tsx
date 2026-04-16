import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Download, ArrowRight, ChevronDown, Monitor, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductData } from "@/data/products";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const ProductPageLayout = ({ product }: { product: ProductData }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const Icon = product.icon;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero text-hero-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
        <div className="section-container relative py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <div className={`mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium ${product.color}`}>
                <Icon className="h-3.5 w-3.5" /> WindowsUtils
              </div>
              <h1 className="text-3xl font-extrabold font-heading sm:text-4xl lg:text-5xl leading-tight">
                {product.title}
              </h1>
              <p className="mt-3 text-lg text-hero-muted font-medium">{product.tagline}</p>
              <p className="mt-4 max-w-xl text-sm text-hero-muted/80 leading-relaxed">{product.description}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" className="accent-gradient text-accent-foreground font-semibold gap-2 hover:opacity-90">
                  <Download className="h-4 w-4" /> Free Download
                </Button>
                <Link to={`/buy/${product.slug}`}>
                  <Button size="lg" variant="outline" className="border-white/20 text-hero-foreground hover:bg-white/10 gap-2">
                    Buy Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-hero-muted">
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Free trial available</span>
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> No credit card required</span>
                <span className="flex items-center gap-1.5"><Monitor className="h-3.5 w-3.5" /> Windows only</span>
              </div>
            </motion.div>

            {/* Product visual */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
                  <div className="rounded-xl bg-card/90 p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${product.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{product.title}</p>
                        <p className="text-xs text-muted-foreground">v4.2.1 — Latest</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {product.features.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="h-3 w-3 text-success shrink-0" /> {f.title}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                      ))}
                      <span className="ml-1 text-xs text-muted-foreground">4.8/5 (2,400+ reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Features</span>
            <h2 className="mt-3 text-3xl font-extrabold font-heading text-foreground">Why Choose {product.title}?</h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="rounded-xl border border-border bg-card p-6 card-hover"
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${product.color}`}>
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold font-heading text-foreground">{feat.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="section-container">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">How It Works</span>
            <h2 className="mt-3 text-3xl font-extrabold font-heading text-foreground">3 Simple Steps</h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {product.steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="relative text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl primary-gradient text-primary-foreground font-heading text-2xl font-extrabold shadow-lg">
                  {s.step}
                </div>
                {i < 2 && (
                  <div className="absolute top-8 left-[calc(50%+40px)] hidden w-[calc(100%-80px)] border-t-2 border-dashed border-border md:block" />
                )}
                <h3 className="text-lg font-bold font-heading text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System Requirements & FAQ */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* System Reqs */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Compatibility</span>
              <h2 className="mt-3 text-2xl font-extrabold font-heading text-foreground">System Requirements</h2>
              <ul className="mt-6 space-y-3">
                {product.systemReqs.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 mt-0.5 text-success shrink-0" /> {req}
                  </li>
                ))}
              </ul>
              {product.formats && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Supported Formats</p>
                  <div className="flex flex-wrap gap-2">
                    {product.formats.map(f => (
                      <span key={f} className="rounded-md bg-muted px-3 py-1 text-xs font-medium text-foreground">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* FAQ */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">FAQ</span>
              <h2 className="mt-3 text-2xl font-extrabold font-heading text-foreground">Frequently Asked Questions</h2>
              <div className="mt-6 space-y-3">
                {product.faqs.map((faq, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
                    >
                      {faq.q}
                      <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="border-t border-border px-4 pb-4 pt-3 text-sm text-muted-foreground leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-hero text-hero-foreground">
        <div className="section-container text-center">
          <h2 className="text-3xl font-extrabold font-heading">Ready to Get Started?</h2>
          <p className="mt-3 text-hero-muted max-w-xl mx-auto">
            Download {product.title} free trial today. No credit card required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="accent-gradient text-accent-foreground font-semibold gap-2 hover:opacity-90">
              <Download className="h-4 w-4" /> Download Free Trial
            </Button>
            <Link to="/support">
              <Button size="lg" variant="outline" className="border-white/20 text-hero-foreground hover:bg-white/10">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPageLayout;
