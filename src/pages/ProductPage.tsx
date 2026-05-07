import { useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductPageLayout from "@/components/ProductPageLayout";
import { products } from "@/data/products";
import SEO from "@/components/SEO";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? products[slug] : undefined;

  if (!product) return <Navigate to="/" replace />;

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

  return (
    <div className="min-h-screen">
      <SEO
        title={`${product.title} - ${product.tagline}`}
        description={product.description}
        path={`/products/${product.slug}`}
        type="product"
        keywords={`${product.title}, ${product.tagline}, Windows utility, ${product.slug}`}
        schema={faqSchema ? [productSchema, faqSchema] : productSchema}
      />
      <Navbar />
      <ProductPageLayout product={product} />
      <Footer />
    </div>
  );
};

export default ProductPage;
