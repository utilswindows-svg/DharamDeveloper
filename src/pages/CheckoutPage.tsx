import { useParams, useSearchParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Lock, Mail, User, Building2, Globe, MapPin, Info, CheckCircle2 } from "lucide-react";
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
import SEO from "@/components/SEO";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { api, useAppDispatch, useAppSelector } from "@/store/authStore";

const CheckoutPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const licenseIndex = parseInt(searchParams.get("license") || "0", 10);
  const product = slug ? products[slug] : undefined;
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.user);
  const [billing, setBilling] = useState({
    firstName: "", lastName: "", email: "", company: "", country: "", zip: "",
  });
  const [orderId, setOrderId] = useState<number | null>(null);
  const [savingBilling, setSavingBilling] = useState(false);
  const [paidOrder, setPaidOrder] = useState<any>(null);
  const [accountInfo, setAccountInfo] = useState<{ created: boolean; tempPassword?: string } | null>(null);

  if (!product) return <Navigate to="/" replace />;

  const license = product.licenses[licenseIndex] || product.licenses[0];
  const Icon = product.icon;
  const tax = +(license.price * 0.18).toFixed(2);
  const total = +(license.price + tax).toFixed(2);
  const paypalClientId = (import.meta as any).env?.VITE_PAYPAL_CLIENT_ID || "";

  const billingValid =
    billing.firstName && billing.lastName && billing.email &&
    billing.country && billing.zip;

  const saveBilling = async (): Promise<number | null> => {
    if (orderId) return orderId;
    if (!billingValid) {
      toast({ title: "Please complete billing info", variant: "destructive" });
      return null;
    }
    setSavingBilling(true);
    try {
      const { data } = await api.post("/user/orders", {
        ...billing,
        productSlug: product.slug,
        productTitle: product.title,
        licenseName: license.name,
        licenseIndex,
        subtotal: license.price,
        tax,
        total,
        currency: "USD",
      });
      setOrderId(data.order.id);
      // Persist tokens + user so the buyer is logged in immediately
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("isLoggedIn", "true");
      }
      if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        // Update redux store
        dispatch({
          type: "auth/login/fulfilled",
          payload: { user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken },
        });
      }
      if (data.createdAccount) {
        setAccountInfo({ created: true, tempPassword: data.tempPassword });
        toast({
          title: "Account created & logged in",
          description: `A temporary password was generated. Please change it from your profile.`,
        });
      } else if (!currentUser) {
        toast({ title: "Logged in", description: `Welcome back, ${data.user?.name || data.user?.email}` });
      }
      return data.order.id as number;
    } catch (err: any) {
      toast({
        title: "Could not save billing info",
        description: err?.response?.data?.message || err.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setSavingBilling(false);
    }
  };

  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveBilling();
  };

  const setField = (k: keyof typeof billing) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setBilling((b) => ({ ...b, [k]: e.target.value }));

  return (
    <TooltipProvider>
      <div className="min-h-screen">
      <SEO title="Checkout" description="Complete your secure purchase of WindowsUtils software." path="/checkout" keywords="checkout, payment, purchase" type="product" />
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
          <form onSubmit={handleSaveClick}>
            <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
              {/* Left – Form */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {/* Billing Info */}
                <div className="rounded-xl border border-border bg-card p-6 mb-6">
                  <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2 mb-5">
                    <User className="h-5 w-5 text-accent" /> Billing Information
                    {orderId && (
                      <span className="ml-auto text-xs font-medium text-success inline-flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Saved
                      </span>
                    )}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-xs font-semibold text-muted-foreground">First Name *</Label>
                      <Input id="firstName" placeholder="John" value={billing.firstName} onChange={setField("firstName")} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-xs font-semibold text-muted-foreground">Last Name *</Label>
                      <Input id="lastName" placeholder="Doe" value={billing.lastName} onChange={setField("lastName")} required />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="john@example.com" className="pl-10" value={billing.email} onChange={setField("email")} required />
                      </div>
                      <p className="text-[11px] text-muted-foreground">License key will be delivered to this email</p>
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label htmlFor="company" className="text-xs font-semibold text-muted-foreground">Company Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="company" placeholder="Company (optional)" className="pl-10" value={billing.company} onChange={setField("company")} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="country" className="text-xs font-semibold text-muted-foreground">Country *</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="country" placeholder="United States" className="pl-10" value={billing.country} onChange={setField("country")} required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="zip" className="text-xs font-semibold text-muted-foreground">ZIP / Postal Code *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="zip" placeholder="10001" className="pl-10" value={billing.zip} onChange={setField("zip")} required />
                      </div>
                    </div>
                  </div>
                  {!orderId && (
                    <Button type="submit" variant="outline" className="mt-5 w-full" disabled={savingBilling || !billingValid}>
                      {savingBilling ? "Saving..." : "Save Billing Info"}
                    </Button>
                  )}
                </div>

                {/* Payment — PayPal */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-bold font-heading text-foreground flex items-center gap-2 mb-5">
                    <Lock className="h-5 w-5 text-accent" /> Pay with PayPal
                  </h2>

                  {paidOrder ? (
                    <div className="rounded-lg border border-success bg-success/5 p-5 text-center">
                      <CheckCircle2 className="h-10 w-10 text-success mx-auto mb-2" />
                      <p className="font-bold text-foreground">Payment Successful!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Order #{paidOrder.id} • License key sent to {paidOrder.email}
                      </p>
                      {paidOrder.licenseKey && (
                        <p className="mt-3 font-mono text-sm bg-muted px-3 py-2 rounded inline-block">
                          {paidOrder.licenseKey}
                        </p>
                      )}
                      {accountInfo?.created && accountInfo.tempPassword && (
                        <div className="mt-4 text-left border border-border rounded-lg p-3 bg-background">
                          <p className="text-xs font-semibold text-foreground mb-1">Your new account</p>
                          <p className="text-xs text-muted-foreground">Email: <span className="font-mono">{paidOrder.email}</span></p>
                          <p className="text-xs text-muted-foreground">Temporary password: <span className="font-mono">{accountInfo.tempPassword}</span></p>
                          <p className="text-[11px] text-muted-foreground mt-2">Please change your password from your profile after logging in.</p>
                        </div>
                      )}
                    </div>
                  ) : !paypalClientId ? (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-muted-foreground">
                      PayPal is not configured. Set <code className="font-mono">VITE_PAYPAL_CLIENT_ID</code> in your frontend env.
                    </div>
                  ) : (
                    <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD", intent: "capture" }}>
                      <PayPalButtons
                        style={{ layout: "vertical", shape: "rect", label: "paypal" }}
                        disabled={!billingValid}
                        forceReRender={[total, billing.email]}
                        createOrder={async () => {
                          const id = await saveBilling();
                          if (!id) throw new Error("Billing not saved");
                          const { data } = await api.post(`/user/orders/${id}/paypal/create`);
                          return data.paypalOrderId as string;
                        }}
                        onApprove={async (data) => {
                          const id = orderId;
                          if (!id) return;
                          try {
                            const { data: res } = await api.post(`/user/orders/${id}/paypal/capture`, {
                              paypalOrderId: data.orderID,
                            });
                            setPaidOrder(res.order);
                            toast({
                              title: "Payment Successful",
                              description: `License key sent to ${res.order.email}`,
                            });
                          } catch (err: any) {
                            toast({
                              title: "Capture failed",
                              description: err?.response?.data?.message || err.message,
                              variant: "destructive",
                            });
                          }
                        }}
                        onError={(err) => {
                          toast({ title: "PayPal error", description: String(err), variant: "destructive" });
                        }}
                      />
                    </PayPalScriptProvider>
                  )}

                  <div className="flex items-center gap-3 mt-5 p-3 rounded-lg bg-muted/50 border border-border">
                    <ShieldCheck className="h-5 w-5 text-success shrink-0" />
                    <p className="text-xs text-muted-foreground">Payment is processed securely by PayPal. We never see your card details.</p>
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

                  <p className="text-[11px] text-muted-foreground text-center">
                    Complete the billing form, then pay with PayPal on the left.
                  </p>
                  <p className="text-[10px] text-muted-foreground text-center mt-2">
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
