import { useParams, useSearchParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Lock, CreditCard, Mail, User, Building2, Globe, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CheckoutPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const licenseIndex = parseInt(searchParams.get("license") || "0", 10);
  const product = slug ? products[slug] : undefined;
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!product) return <Navigate to="/" replace />;

  const license = product.licenses[licenseIndex] || product.licenses[0];
  const Icon = product.icon;
  const tax = +(license.price * 0.18).toFixed(2);
  const total = +(license.price + tax).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Order Placed Successfully!",
        description: `Your license key for ${product.title} (${license.name}) will be sent to your email shortly.`,
      });
    }, 2000);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-hero text-hero-foreground py-8">
        <div className="section-container">
          <Link to={`/buy/${slug}`} className="inline-flex items-center gap-1.5 text-xs text-hero-muted hover:text-hero-foreground transition-colors mb-4">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Pricing
          </Link>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent" />
            <h1 className="text-2xl font-extrabold font-heading sm:text-3xl">Secure Checkout</h1>
          </div>
          <p className="mt-1 text-hero-muted text-sm">Complete your purchase with 256-bit SSL encryption</p>
        </div>
      </section>

      {/* Main */}
      <section className="py-12 bg-background">
        <div className="section-container">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
              {/* Left – Form */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {/* Billing Info */}
                <div className="rounded-xl border border-border bg-card p-6 mb-6">
                  <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2 mb-5">
                    <User className="h-5 w-5 text-accent" /> Billing Information
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-xs font-semibold text-muted-foreground">First Name *</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-xs font-semibold text-muted-foreground">Last Name *</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="john@example.com" className="pl-10" required />
                      </div>
                      <p className="text-[11px] text-muted-foreground">License key will be delivered to this email</p>
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label htmlFor="company" className="text-xs font-semibold text-muted-foreground">Company Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="company" placeholder="Company (optional)" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="country" className="text-xs font-semibold text-muted-foreground">Country *</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="country" placeholder="United States" className="pl-10" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="zip" className="text-xs font-semibold text-muted-foreground">ZIP / Postal Code *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="zip" placeholder="10001" className="pl-10" required />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2 mb-5">
                    <CreditCard className="h-5 w-5 text-accent" /> Payment Details
                  </h2>
                  <div className="grid gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="cardName" className="text-xs font-semibold text-muted-foreground">Name on Card *</Label>
                      <Input id="cardName" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cardNumber" className="text-xs font-semibold text-muted-foreground">Card Number *</Label>
                      <Input id="cardNumber" placeholder="4242 4242 4242 4242" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="expiry" className="text-xs font-semibold text-muted-foreground">Expiry Date *</Label>
                        <Input id="expiry" placeholder="MM / YY" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="cvv" className="text-xs font-semibold text-muted-foreground">CVV *</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-5 p-3 rounded-lg bg-muted/50 border border-border">
                    <ShieldCheck className="h-5 w-5 text-success shrink-0" />
                    <p className="text-xs text-muted-foreground">Your payment information is encrypted and secure. We never store your card details.</p>
                  </div>
                </div>
              </motion.div>

              {/* Right – Order Summary */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
                  <h2 className="text-lg font-bold font-heading text-foreground mb-5">Order Summary</h2>

                  {/* Product */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${product.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold font-heading text-foreground text-sm truncate">{product.title}</p>
                      <p className="text-xs text-muted-foreground">{license.name} License</p>
                    </div>
                  </div>

                  <Separator className="mb-4" />

                  {/* Price breakdown */}
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{license.name} License</span>
                      <span className="font-semibold text-foreground">${license.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{license.machines}</span>
                    </div>
                    {license.originalPrice && (
                      <div className="flex justify-between text-success">
                        <span>Discount</span>
                        <span>-${(license.originalPrice - license.price).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        Estimated Tax
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3" />
                          </TooltipTrigger>
                          <TooltipContent>GST 18% applicable</TooltipContent>
                        </Tooltip>
                      </span>
                      <span className="text-foreground">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-baseline mb-5">
                    <span className="text-base font-bold font-heading text-foreground">Total</span>
                    <span className="text-2xl font-extrabold font-heading text-foreground">${total.toFixed(2)}</span>
                  </div>

                  {/* Coupon */}
                  <div className="flex gap-2 mb-5">
                    <Input placeholder="Coupon code" className="text-xs" />
                    <Button type="button" variant="outline" size="sm" className="shrink-0 text-xs">Apply</Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full accent-gradient text-accent-foreground font-bold text-sm h-12"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
                  </Button>

                  <p className="text-[10px] text-muted-foreground text-center mt-3">
                    By completing this purchase you agree to our{" "}
                    <Link to="/eula" className="underline hover:text-foreground">EULA</Link>{" "}
                    and{" "}
                    <Link to="/refund-policy" className="underline hover:text-foreground">Refund Policy</Link>.
                  </p>

                  {/* Trust badges */}
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {["256-bit SSL", "Instant Delivery", "30-Day Refund", "24/7 Support"].map((badge) => (
                      <div key={badge} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <ShieldCheck className="h-3 w-3 text-success shrink-0" />
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
    </TooltipProvider>
  );
};

export default CheckoutPage;
