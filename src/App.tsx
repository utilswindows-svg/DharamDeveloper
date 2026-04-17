import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Support from "./pages/Support.tsx";
import HelpCenter from "./pages/HelpCenter.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import BuyPage from "./pages/BuyPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import Eula from "./pages/Eula.tsx";
import Privacy from "./pages/Privacy.tsx";
import RefundPolicy from "./pages/RefundPolicy.tsx";
import QualityPolicy from "./pages/QualityPolicy.tsx";
import Legal from "./pages/Legal.tsx";
import CookiePreferences from "./pages/CookiePreferences.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/buy/:slug" element={<BuyPage />} />
          <Route path="/checkout/:slug" element={<CheckoutPage />} />
          <Route path="/eula" element={<Eula />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/quality-policy" element={<QualityPolicy />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/cookie-preferences" element={<CookiePreferences />} />
          <Route path="/login" element={<Support />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
