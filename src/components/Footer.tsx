import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-hero text-hero-muted">
    <div className="section-container py-14">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg primary-gradient">
              <span className="text-sm font-bold text-primary-foreground font-heading">W</span>
            </div>
            <span className="text-lg font-bold font-heading text-hero-foreground">
              Windows<span className="text-accent">Utils</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Professional Windows utility tools for data recovery, email migration, PDF management, and system optimization.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-hero-foreground">Products</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { name: "MBox to PDF", slug: "mbox-to-pdf" },
              { name: "PDF Unlocker", slug: "pdf-tools" },
            ].map(p => (
              <li key={p.slug}>
                <Link to={`/software/${p.slug}`} className="hover:text-hero-foreground transition-colors">{p.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-hero-foreground">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-hero-foreground transition-colors">About Us</Link></li>
            <li><Link to="/support" className="hover:text-hero-foreground transition-colors">Support</Link></li>
            <li><Link to="/help" className="hover:text-hero-foreground transition-colors">Help Center</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-hero-foreground">Contact</h4>
          <ul className="space-y-2.5 text-sm">
            <li>support@windowsutils.com</li>
            <li>sales@windowsutils.com</li>
            <li>Monday – Friday, 9am – 6pm</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-hero-muted/20 pt-8 space-y-4">
        <div className="flex flex-wrap justify-center items-center gap-3 text-xs">
          <Link to="/eula" className="hover:text-hero-foreground transition-colors">EULA</Link>
          <span className="text-hero-muted/40">|</span>
          <Link to="/privacy" className="hover:text-hero-foreground transition-colors">Privacy Statement</Link>
          <span className="text-hero-muted/40">|</span>
          <Link to="/refund-policy" className="hover:text-hero-foreground transition-colors">Refund Policy</Link>
          <span className="text-hero-muted/40">|</span>
          <Link to="/quality-policy" className="hover:text-hero-foreground transition-colors">Quality Policy</Link>
        </div>
        
        <div className="text-center text-xs leading-relaxed">
          <p>© Copyright 2007-2026 by WindowsUtils.</p>
          <p>WindowsUtils® is a Registered Trademark of Windows Utils Pvt. Ltd.</p>
        </div>
        
        <div className="flex justify-center items-center gap-3 text-xs">
          <Link to="/legal" className="hover:text-hero-foreground transition-colors">Legal</Link>
          <span className="text-hero-muted/40">|</span>
          <Link to="/cookie-preferences" className="hover:text-hero-foreground transition-colors">Cookie Preferences</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
