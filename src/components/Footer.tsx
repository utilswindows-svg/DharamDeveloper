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
            {["MBox to PDF", "PST Migration", "MSG Migration", "MSG to PDF", "Data Recovery", "PDF Tools", "PC Optimizer"].map(p => (
              <li key={p}>
                <Link to={`/products/${p.toLowerCase().replace(/ /g, "-")}`} className="hover:text-hero-foreground transition-colors">{p}</Link>
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
            <li>Monday – Friday, 9am – 6pm</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-hero-muted/20 pt-8 text-center text-xs">
        © {new Date().getFullYear()} WindowsUtils. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
