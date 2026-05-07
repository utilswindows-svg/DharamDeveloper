import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import SEO from "@/components/SEO";

const faqs = [
  { q: "How do I install WindowsUtils software?", a: "Download the installer from the product page, run the .exe file, and follow the on-screen instructions. All our installers are digitally signed for your safety.", category: "Installation" },
  { q: "Is there a free trial available?", a: "Yes! Every WindowsUtils product comes with a free trial version. You can evaluate the software before making a purchase.", category: "Products" },
  { q: "How do I activate my license?", a: "After purchase, you'll receive a license key via email. Open the software, go to Help > Activate License, and enter your key.", category: "Licensing" },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and bank transfers. All transactions are processed through secure payment gateways.", category: "Billing" },
  { q: "Can I get a refund?", a: "We offer a 30-day money-back guarantee. If you're not satisfied, contact our support team for a full refund.", category: "Billing" },
  { q: "How do I convert MBOX to PDF?", a: "Install MBox to PDF tool, add your MBOX file, select output settings, and click Convert. The tool handles batch conversions with attachments.", category: "Products" },
  { q: "Is my data safe during migration?", a: "Absolutely. All our migration tools work locally on your machine. No data is uploaded to external servers during the process.", category: "Products" },
  { q: "Do you offer bulk/enterprise licenses?", a: "Yes, we offer volume licensing for organizations. Contact our sales team at sales@windowsutils.com for custom pricing.", category: "Licensing" },
];

const categories = ["All", "Installation", "Licensing", "Products", "Billing"];

const HelpCenter = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = faqs.filter(f => 
    (f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())) &&
    (selectedCategory === "All" || f.category === selectedCategory)
  );

  return (
    <div className="min-h-screen">
      <SEO title="Help Center" description="Browse guides, FAQs, and tutorials for WindowsUtils products. Find answers fast." path="/help" keywords="help center, FAQ, tutorials, guides" type="website" />
      <Navbar />
      <section className="hero-gradient py-20">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Help Center</span>
            <h1 className="mt-3 text-4xl font-extrabold font-heading text-hero-foreground sm:text-5xl">
              How Can We Help?
            </h1>
            <div className="mx-auto mt-8 max-w-lg relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-hero-muted" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-hero-muted/30 bg-hero-foreground/10 py-3.5 pl-12 pr-4 text-hero-foreground placeholder:text-hero-muted backdrop-blur-sm outline-none focus:border-accent transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container max-w-3xl">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map(c => (
              <button 
                key={c} 
                onClick={() => setSelectedCategory(c)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedCategory === c 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-foreground font-heading">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="border-t border-border px-6 py-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No results found. Try a different search term.</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HelpCenter;
