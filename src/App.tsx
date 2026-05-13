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
import Products from "./pages/Products.tsx";
import SoftwareTools from "./pages/SoftwareTools.tsx";
import BuyPage from "./pages/BuyPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import Eula from "./pages/Eula.tsx";
import Privacy from "./pages/Privacy.tsx";
import RefundPolicy from "./pages/RefundPolicy.tsx";
import QualityPolicy from "./pages/QualityPolicy.tsx";
import Legal from "./pages/Legal.tsx";
import CookiePreferences from "./pages/CookiePreferences.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import UserDashboard from "./pages/UserDashboard.tsx";
import Profile from "./pages/Profile.tsx";
import Downloads from "./pages/Downloads.tsx";
import Billing from "./pages/Billing.tsx";
import Settings from "./pages/Settings.tsx";
import AdminDownloads from "./pages/admin/AdminDownloads.tsx";
import Licenses from "./pages/Licenses.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminLicenses from "./pages/admin/AdminLicenses.tsx";
import AdminTickets from "./pages/admin/AdminTickets.tsx";
import AdminFeedback from "./pages/admin/AdminFeedback.tsx";
import AdminContacts from "./pages/admin/AdminContacts.tsx";
import AdminHelp from "./pages/admin/AdminHelp.tsx";
import AdminProfile from "./pages/admin/AdminProfile.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminPayments from "./pages/admin/AdminPayments.tsx";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";

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
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/software/tools" element={<SoftwareTools />} />
          <Route path="/buy/:slug" element={<BuyPage />} />
          <Route path="/checkout/:slug" element={<CheckoutPage />} />
          <Route path="/eula" element={<Eula />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/quality-policy" element={<QualityPolicy />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/cookie-preferences" element={<CookiePreferences />} />
          <Route path="/login" element={<PublicRoute restricted><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute restricted><Signup /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute restricted><ForgotPassword /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/downloads" element={<PrivateRoute><Downloads /></PrivateRoute>} />
          <Route path="/licenses" element={<PrivateRoute><Licenses /></PrivateRoute>} />
          <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute roles={["admin"]}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/downloads" element={<PrivateRoute roles={["admin"]}><AdminDownloads /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={["admin"]}><AdminUsers /></PrivateRoute>} />
          <Route path="/admin/licenses" element={<PrivateRoute roles={["admin"]}><AdminLicenses /></PrivateRoute>} />
          <Route path="/admin/tickets" element={<PrivateRoute roles={["admin"]}><AdminTickets /></PrivateRoute>} />
          <Route path="/admin/feedback" element={<PrivateRoute roles={["admin"]}><AdminFeedback /></PrivateRoute>} />
          <Route path="/admin/contacts" element={<PrivateRoute roles={["admin"]}><AdminContacts /></PrivateRoute>} />
          <Route path="/admin/help" element={<PrivateRoute roles={["admin"]}><AdminHelp /></PrivateRoute>} />
          <Route path="/admin/payments" element={<PrivateRoute roles={["admin"]}><AdminPayments /></PrivateRoute>} />
          <Route path="/admin/profile" element={<PrivateRoute roles={["admin"]}><AdminProfile /></PrivateRoute>} />
          <Route path="/admin/settings" element={<PrivateRoute roles={["admin"]}><AdminSettings /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
