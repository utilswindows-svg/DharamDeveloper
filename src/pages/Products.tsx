import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Mail, FileInput, MailOpen, FileOutput, HardDrive, FileText, Cpu, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '@/components/SEO';
import { api } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

interface ApiCategory {
  id: number;
  key: string;
  label: string;
  description?: string | null;
  sortOrder: number;
}

interface ApiProduct {
  id: number;
  slug: string;
  title: string;
  tagline?: string | null;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  startingPrice?: number | string | null;
  featured?: boolean;
  sortOrder?: number;
  category?: { id: number; key: string; label: string } | null;
  categoryId?: number | null;
}

const ICON_MAP: Record<string, any> = {
  'mbox-to-pdf': Mail,
  'pst-migration': FileInput,
  'msg-migration': MailOpen,
  'msg-to-pdf': FileOutput,
  'data-recovery': HardDrive,
  'pdf-tools': FileText,
  'pc-optimizer': Cpu,
  Mail, FileInput, MailOpen, FileOutput, HardDrive, FileText, Cpu,
};

const ACCENTS: Record<string, string> = {
  'mbox-to-pdf': 'border-primary/20 text-primary',
  'pst-migration': 'border-accent/20 text-accent',
  'msg-migration': 'border-success/20 text-success',
  'msg-to-pdf': 'border-teal/20 text-teal',
  'data-recovery': 'border-primary/20 text-primary',
  'pdf-tools': 'border-accent/20 text-accent',
  'pc-optimizer': 'border-success/20 text-success',
};

const Products: React.FC = () => {
  const { toast } = useToast();
  const [activeCat, setActiveCat] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get('/catalog/products');
        if (!mounted) return;
        setCategories(data?.categories || []);
        setProducts(data?.products || []);
      } catch (err: any) {
        toast({
          title: 'Failed to load products',
          description: err?.response?.data?.message || err.message,
          variant: 'destructive',
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [toast]);

  // Group products by category and apply search filter
  const grouped = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matchesSearch = (p: ApiProduct) => {
      if (!term) return true;
      return (
        p.title.toLowerCase().includes(term) ||
        (p.tagline || '').toLowerCase().includes(term) ||
        (p.description || '').toLowerCase().includes(term)
      );
    };

    return categories
      .filter((c) => activeCat === 'all' || c.key === activeCat)
      .map((c) => ({
        ...c,
        items: products
          .filter((p) => p.category?.id === c.id || p.categoryId === c.id)
          .filter(matchesSearch),
      }));
  }, [categories, products, activeCat, search]);

  const totalCount = products.length;

  return (
    <div className="min-h-screen">
      <SEO
        title="All Products — WindowsUtils Software Catalog"
        description="Browse the complete WindowsUtils catalog: email migration, PDF tools, data recovery, and PC optimization software for Windows."
        path="/software/tools"
        keywords="windows software, email migration, pdf tools, data recovery, pc optimizer"
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
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Software Catalog</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-4">All Products</h1>
            <p className="text-lg text-hero-muted">
              {loading
                ? 'Loading our software catalog...'
                : `Explore ${totalCount} professional Windows utilities across ${categories.length} categories — built to simplify your workflow and protect your data.`}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="section-container py-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCat('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCat === 'all' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCat(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCat === cat.key ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>
      </section>

      {/* Category sections */}
      <section className="py-16">
        <div className="section-container space-y-16">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-muted-foreground">Loading catalog...</p>
            </div>
          )}

          {!loading && grouped.every((c) => c.items.length === 0) && (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No products match your search.</p>
            </div>
          )}

          {!loading && grouped.map((cat) => {
            if (cat.items.length === 0) return null;
            return (
              <div key={cat.key}>
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">{cat.label}</h2>
                  {cat.description && <p className="mt-2 text-muted-foreground max-w-2xl">{cat.description}</p>}
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {cat.items.map((p, i) => {
                    const Icon = (p.icon && ICON_MAP[p.icon]) || ICON_MAP[p.slug] || FileText;
                    const accent = ACCENTS[p.slug] || 'border-border text-primary';
                    const startingPrice =
                      p.startingPrice !== null && p.startingPrice !== undefined && p.startingPrice !== ''
                        ? Number(p.startingPrice)
                        : null;
                    return (
                      <motion.div
                        key={p.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                      >
                        <Link
                          to={`/software/${p.slug}`}
                          className={`group flex h-full flex-col rounded-xl border ${accent} bg-card p-6 card-hover`}
                        >
                          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${accent.split(' ').find((c) => c.startsWith('text-'))}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <h3 className="text-lg font-bold font-heading text-foreground">{p.title}</h3>
                          <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {p.tagline || p.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            {startingPrice !== null && !Number.isNaN(startingPrice) && (
                              <span className="text-sm">
                                <span className="text-muted-foreground">From </span>
                                <span className="font-bold text-foreground">${startingPrice}</span>
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                              Learn More <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;