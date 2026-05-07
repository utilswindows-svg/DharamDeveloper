import LegalPageLayout from "./legal/LegalPageLayout";
import { Link } from "react-router-dom";
import { FileText, Shield, RefreshCw, Award, Cookie, Scale } from "lucide-react";
import SEO from "@/components/SEO";

const legalDocs = [
  { icon: FileText, title: "EULA", desc: "End User License Agreement governing software use.", href: "/eula" },
  { icon: Shield, title: "Privacy Statement", desc: "How we collect, use, and protect your data.", href: "/privacy" },
  { icon: RefreshCw, title: "Refund Policy", desc: "30-day money-back guarantee details.", href: "/refund-policy" },
  { icon: Award, title: "Quality Policy", desc: "Our commitment to product excellence.", href: "/quality-policy" },
  { icon: Cookie, title: "Cookie Preferences", desc: "Manage cookies and tracking settings.", href: "/cookie-preferences" },
];

const Legal = () => (
  <>
    <SEO title="Legal Documents" description="Browse all WindowsUtils legal documents — EULA, Privacy Policy, Refund Policy, and more." path="/legal" keywords="legal, terms, policies" type="website" />
  <LegalPageLayout
    title="Legal Information"
    subtitle="All legal documents, policies, and compliance information in one place."
    lastUpdated="January 1, 2026"
  >
    <h2>About WindowsUtils Pvt. Ltd.</h2>
    <p>
      WindowsUtils® is a registered trademark of Windows Utils Pvt. Ltd., a software company specializing in
      Windows utility tools for data recovery, email migration, PDF management, and PC optimization since 2007.
    </p>

    <h2>Legal Documents</h2>
    <div className="not-prose grid sm:grid-cols-2 gap-4 mt-6">
      {legalDocs.map(doc => {
        const Icon = doc.icon;
        return (
          <Link
            key={doc.href}
            to={doc.href}
            className="group flex gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                {doc.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{doc.desc}</p>
            </div>
          </Link>
        );
      })}
    </div>

    <h2>Trademarks</h2>
    <p>
      <strong>WindowsUtils®</strong> is a registered trademark of Windows Utils Pvt. Ltd. All other product
      names, logos, and brands mentioned are the property of their respective owners. Microsoft, Windows,
      Outlook, and Office are registered trademarks of Microsoft Corporation.
    </p>

    <h2>Compliance</h2>
    <p>
      WindowsUtils complies with applicable international regulations including GDPR (European Union),
      CCPA (California), and other data protection laws. Our software is digitally signed and verified
      by trusted Certificate Authorities.
    </p>

    <h2>Disclaimer</h2>
    <p>
      The software is provided "as is" without warranty of any kind. While we make every effort to ensure
      accuracy and reliability, users are encouraged to maintain backups before performing data operations.
    </p>

    <h2>Contact Legal Department</h2>
    <p>
      For legal inquiries, please contact <strong>legal@windowsutils.com</strong>. For general support,
      visit our <Link to="/support" className="text-primary hover:underline">Support page</Link>.
    </p>

    <div className="not-prose mt-8 p-4 rounded-lg bg-muted/50 border border-border">
      <Scale className="h-5 w-5 text-muted-foreground inline mr-2" />
      <span className="text-sm text-muted-foreground">
        © Copyright 2007–2026 by WindowsUtils Pvt. Ltd. All rights reserved.
      </span>
    </div>
  </LegalPageLayout>
  </>
);

export default Legal;
