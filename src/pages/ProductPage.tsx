import { useParams, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Mail, FileInput, MailOpen, FileOutput, HardDrive, FileText, Cpu, Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductPageLayout from "@/components/ProductPageLayout";
import { products as localProducts, type ProductData } from "@/data/products";
import SEO from "@/components/SEO";
import { api } from "@/store/authStore";

const ICON_MAP: Record<string, any> = {
  Mail, FileInput, MailOpen, FileOutput, HardDrive, FileText, Cpu,
};

interface ApiProduct {
  slug: string;
  title: string;
  tagline?: string | null;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  startingPrice?: number | string | null;
  features?: { title: string; desc: string }[] | null;
  steps?: { step: string; title: string; desc: string }[] | null;
  faqs?: { q: string; a: string }[] | null;
  systemReqs?: string[] | null;
  formats?: string[] | null;
  licenses?: { name: string; price: number; originalPrice?: number; machines: string; desc: string }[] | null;
}

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [apiProduct, setApiProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const { data } = await api.get(`/catalog/products/${slug}`);
        if (!mounted) return;
        setApiProduct(data?.product || null);
      } catch (err: any) {
        if (!mounted) return;
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          // Network/server error — fall back to local data if we have it
          setApiProduct(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  // Merge API data with locally-bundled assets (screenshots, video, reviews, icon component)
  const product = useMemo<ProductData | null>(() => {
    if (!slug) return null;
    const local = localProducts[slug];
    if (!apiProduct && local) return local; // fallback when API unreachable
    if (!apiProduct) return null;

    const Icon = (apiProduct.icon && ICON_MAP[apiProduct.icon]) || local?.icon || FileText;
    return {
      slug: apiProduct.slug,
      title: apiProduct.title,
      tagline: apiProduct.tagline || "",
      description: apiProduct.description || "",
      icon: Icon,
      color: apiProduct.color || local?.color || "text-primary",
      features: apiProduct.features?.length ? apiProduct.features : (local?.features || []),
      steps: apiProduct.steps?.length ? apiProduct.steps : (local?.steps || []),
      faqs: apiProduct.faqs?.length ? apiProduct.faqs : (local?.faqs || []),
      systemReqs: apiProduct.systemReqs?.length ? apiProduct.systemReqs : (local?.systemReqs || []),
      formats: apiProduct.formats?.length ? apiProduct.formats : local?.formats,
      licenses: apiProduct.licenses?.length
        ? apiProduct.licenses.map((l) => ({ ...l, price: Number(l.price), originalPrice: l.originalPrice ? Number(l.originalPrice) : undefined }))
        : (local?.licenses || []),
      // Visual extras still come from the bundled assets
      screenshots: local?.screenshots,
      videoUrl: local?.videoUrl,
      videoPoster: local?.videoPoster,
      reviews: local?.reviews,
    };
  }, [apiProduct, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !product) return <Navigate to="/products" replace />;

  const minPrice = product.licenses?.length
    ? Math.min(...product.licenses.map((l) => l.price))
    : undefined;
  const aggregateRating = product.reviews?.length
    ? {
        "@type": "AggregateRating",
        ratingValue: (
          product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
        ).toFixed(1),
        reviewCount: product.reviews.length,
      }
    : undefined;

  const productSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.title,
    description: product.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Windows",
    ...(minPrice !== undefined && {
      offers: {
        "@type": "Offer",
        price: minPrice,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    }),
    ...(aggregateRating && { aggregateRating }),
  };

  const faqSchema = product.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: product.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  // Dynamic SEO derived from API response
  const apiBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
  const featureKeywords = (product.features || []).slice(0, 4).map((f) => f.title).join(', ');
  const formatKeywords = (product.formats || []).join(', ');
  const categoryLabel = (apiProduct as any)?.category?.label;

  const metaTitle = product.tagline
    ? `${product.title} — ${product.tagline}`
    : product.title;
  const trimmedDescription = (() => {
    const base = product.description || product.tagline || '';
    const priceSuffix = minPrice !== undefined ? ` Starting at $${minPrice}.` : '';
    const max = 160 - priceSuffix.length;
    if (base.length <= max) return `${base}${priceSuffix}`;
    return `${base.slice(0, Math.max(0, max - 1)).trimEnd()}…${priceSuffix}`;
  })();
  const metaKeywords = [
    product.title,
    product.tagline,
    categoryLabel,
    'Windows utility',
    'Windows software',
    product.slug,
    formatKeywords,
    featureKeywords,
  ]
    .filter(Boolean)
    .join(', ');
  const ogImage = `${apiBase}/catalog/products/${product.slug}/og.svg`;

  return (
    <div className="min-h-screen">
      <SEO
        title={metaTitle}
        description={trimmedDescription}
        path={`/products/${product.slug}`}
        type="product"
        keywords={metaKeywords}
        image={ogImage}
        schema={faqSchema ? [productSchema, faqSchema] : productSchema}
      />
      <Navbar />
      <ProductPageLayout product={product} />
      <Footer />
    </div>
  );
};

export default ProductPage;
