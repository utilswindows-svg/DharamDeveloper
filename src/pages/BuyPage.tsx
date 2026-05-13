import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Mail, Clock, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import SEO from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45 } }),
};

const benefits = [
  { icon: ShieldCheck, text: "100% Safe & Secure" },
  { icon: Mail, text: "Instant Delivery by Email" },
  { icon: Clock, text: "24×7 Free Technical Support" },
  { icon: RefreshCw, text: "1 Year Free Product Updates" },
];

const BuyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? products[slug] : undefined;
  const [selectedLicense, setSelectedLicense] = useState(0);

  if (!product) return <Navigate to="/" replace />;

  const Icon = product.icon;

  return (
    <div className="min-h-screen">
      <SEO title="Buy Software" description="Purchase a WindowsUtils license — secure checkout, instant delivery, 30-day money-back guarantee." path="/buy" keywords="buy, purchase, license, software" type="product" />
      <Navbar />

      {/* Hero */}
      <section className="bg-hero text-hero-foreground py-10">
        <div className="section-container">
          <Link to={`/software/${slug}`} className="inline-flex items-center gap-1.5 text-xs text-hero-muted hover:text-hero-foreground transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to {product.title}
          </Link>
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Choose Your License</span>
            <h1 className="mt-2 text-3xl font-extrabold font-heading sm:text-4xl">Buy {product.title}</h1>
            <p className="mt-2 text-hero-muted max-w-xl mx-auto text-sm">Select the license that fits your needs. All licenses include free updates and technical support.</p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 bg-background">
        <div className="section-container">
          <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
            {/* Product sidebar */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${product.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold font-heading text-foreground">{product.title}</p>
                    <p className="text-xs text-muted-foreground">for Windows</p>
                  </div>
                </div>

                <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Special Benefits</p>
                <ul className="space-y-2.5">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <b.icon className="h-4 w-4 text-success shrink-0" /> {b.text}
                    </li>
                  ))}
                  <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    <Link to="/refund-policy" className="underline hover:text-foreground transition-colors">30 Days Money Back Guarantee</Link>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* License cards */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {product.licenses.map((lic, i) => {
                const isSelected = selectedLicense === i;
                const isPopular = i === 1;
                return (
                  <motion.div
                    key={lic.name}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={i + 1}
                    onClick={() => setSelectedLicense(i)}
                    className={`relative cursor-pointer rounded-xl border-2 bg-card p-6 transition-all hover:shadow-lg ${
                      isSelected ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-border hover:border-primary/40"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full accent-gradient px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                        Most Popular
                      </div>
                    )}

                    <div className="text-center pt-2">
                      <h3 className="text-sm font-bold font-heading text-foreground">{lic.name}</h3>
                      <div className="mt-4 flex items-baseline justify-center gap-1.5">
                        {lic.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">${lic.originalPrice}</span>
                        )}
                        <span className="text-4xl font-extrabold font-heading text-foreground">${lic.price}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{lic.machines}</p>
                    </div>

                    <div className="mt-5 border-t border-border pt-4">
                      <p className="text-xs text-muted-foreground leading-relaxed">{lic.desc}</p>
                    </div>

                    <Button
                      className={`mt-5 w-full font-semibold ${isSelected ? "bg-blue-500 text-white" : ""}`}
                      variant={isSelected ? "default" : "outline"}
                      asChild
                    >
                      <Link to={`/checkout/${slug}?license=${i}`}>Buy Now</Link>
                    </Button>

                    {/* Radio indicator */}
                    <div className="absolute top-4 right-4">
                      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features & License Comparison Table */}
      <section className="py-16 bg-muted/30">
        <div className="section-container">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Comparison</span>
            <h2 className="mt-3 text-2xl font-extrabold font-heading text-foreground">Features & License Details</h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-bold text-foreground min-w-[250px]">
                    Key Features — {product.title}
                  </th>
                  {product.licenses.map((lic) => (
                    <th key={lic.name} className="p-4 text-center font-bold text-foreground min-w-[130px]">
                      {lic.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {product.features.map((feat, i) => (
                  <tr key={feat.title} className={`border-b border-border ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                    <td className="p-4 text-foreground font-medium">{feat.title}</td>
                    {product.licenses.map((lic, j) => (
                      <td key={lic.name} className="p-4 text-center">
                        <Check className={`h-4 w-4 mx-auto ${j >= product.licenses.length - 1 ? "text-success" : "text-success"}`} />
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Extra rows for higher tiers */}
                <tr className="border-b border-border">
                  <td className="p-4 text-foreground font-medium">Priority Email Support</td>
                  {product.licenses.map((_, j) => (
                    <td key={j} className="p-4 text-center">
                      {j >= 1 ? <Check className="h-4 w-4 mx-auto text-success" /> : <span className="text-muted-foreground">—</span>}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border bg-muted/20">
                  <td className="p-4 text-foreground font-medium">Remote Installation Assistance</td>
                  {product.licenses.map((_, j) => (
                    <td key={j} className="p-4 text-center">
                      {j >= 2 ? <Check className="h-4 w-4 mx-auto text-success" /> : <span className="text-muted-foreground">—</span>}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4 text-foreground font-medium">Dedicated Account Manager</td>
                  {product.licenses.map((_, j) => (
                    <td key={j} className="p-4 text-center">
                      {j >= 3 ? <Check className="h-4 w-4 mx-auto text-success" /> : <span className="text-muted-foreground">—</span>}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-12 bg-background">
        <div className="section-container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Secure Payment", desc: "256-bit SSL encryption protects your payment information." },
              { title: "Instant Delivery", desc: "License key delivered to your email within minutes." },
              { title: "30-Day Refund", desc: "Not satisfied? Get a full refund within 30 days." },
              { title: "Free Updates", desc: "1 year of free product updates and upgrades included." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center p-5 rounded-xl border border-border bg-card"
              >
                <ShieldCheck className="h-8 w-8 mx-auto text-accent mb-3" />
                <h3 className="text-sm font-bold font-heading text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BuyPage;
