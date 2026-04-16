import { useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductPageLayout from "@/components/ProductPageLayout";
import { products } from "@/data/products";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? products[slug] : undefined;

  if (!product) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen">
      <Navbar />
      <ProductPageLayout product={product} />
      <Footer />
    </div>
  );
};

export default ProductPage;
