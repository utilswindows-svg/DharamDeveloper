import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Mail, FileText, HardDrive, Zap, ArrowRight } from "lucide-react";
import logo from "../assets/logo.png";
import { logout, useAppDispatch, useAppSelector } from "../store/authStore";

const productCategories = [ 
  {
    title: "PDF Tools",
    icon: FileText,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    items: [
      { name: "PDF Unlocker", desc: "Unlock, merge & convert PDFs", href: "/products/pdf-tools" },
    ],
  },
   {
    title: "Email Migration",
    icon: Mail,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    items: [
      { name: "MBox to PDF", desc: "Convert MBOX emails to PDF", href: "/products/mbox-to-pdf" },
    ],
  },
];

const productLinks = productCategories.flatMap(c => c.items);

const navLinks = [
  { name: "Home", href: "/" },
  { name: "View all products", href: "/software/tools" },
  { name: "About Us", href: "/about" },
  { name: "Support", href: "/support" },
  { name: "Help Center", href: "/help" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, accessToken } = useAppSelector((s) => s.auth);
  const isLoggedIn = !!accessToken && !!user;

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-md">
      {/* Top bar */}
      <div className="bg-hero text-hero-foreground">
        <div className="section-container flex items-center justify-end gap-6 py-1.5 text-xs">
          <Link to="/support" className="text-hero-muted hover:text-hero-foreground transition-colors">Support</Link>
          <Link to="/about" className="text-hero-muted hover:text-hero-foreground transition-colors">About Us</Link>
          <Link to="/help" className="text-hero-muted hover:text-hero-foreground transition-colors">Help Center</Link>
        </div>
      </div>

      {/* Main nav */}
      <nav className="section-container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2" style={{width:"33%", height:"40px"}}>
        <img src={logo} title="logo" alt="logo" style={{width:"45%", height:"150%"}} />          
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.href
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Products mega menu */}
          <div className="relative" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
            <button className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              Products <ChevronDown className={`h-3.5 w-3.5 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {productsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full right-0 left-auto mt-1 w-[860px] max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"
                >
                  <div className="grid grid-cols-3 gap-6">
                    {productCategories.map(cat => {
                      const Icon = cat.icon;
                      return (
                        <div key={cat.title}>
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-md ${cat.bg}`}>
                              <Icon className={`h-4 w-4 ${cat.color}`} />
                            </div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">{cat.title}</h4>
                          </div>
                          <div className="space-y-1">
                            {cat.items.map(item => (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setProductsOpen(false)}
                                className="group block rounded-lg px-3 py-2 hover:bg-muted transition-colors"
                              >
                                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {item.name}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      <p className="text-xs text-muted-foreground">Trusted by <span className="font-semibold text-foreground">1M+ users</span> worldwide</p>
                    </div>
                    <Link
                      to="/software/tools"
                      onClick={() => setProductsOpen(false)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2.5 transition-all"
                    >
                      View all products <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
              >
                <User className="h-5 w-5" />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg overflow-hidden"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
                    >
                      <Menu className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <div className="border-t border-border">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="accent-gradient rounded-lg px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90 hover:shadow-lg">
              Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border bg-card"
          >
            <div className="section-container py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-border">
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Products</p>
                {productLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
