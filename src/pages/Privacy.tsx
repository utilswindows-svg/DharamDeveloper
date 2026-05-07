import LegalPageLayout from "./legal/LegalPageLayout";
import SEO from "@/components/SEO";

const Privacy = () => (
  <>
    <SEO title="Privacy Policy" description="Read the WindowsUtils Privacy Policy — how we collect, use, and protect your data." path="/privacy" keywords="privacy policy, data protection, GDPR" type="website" />
  <LegalPageLayout
    title="Privacy Statement"
    subtitle="Your privacy matters. Here's how we collect, use, and protect your information."
    lastUpdated="January 1, 2026"
  >
    <h2>1. Information We Collect</h2>
    <ul>
      <li><strong>Account Information:</strong> Name, email address, billing address, and contact details.</li>
      <li><strong>Payment Information:</strong> Processed securely via PCI-compliant payment providers.</li>
      <li><strong>Usage Data:</strong> License activation, software version, and crash diagnostics.</li>
      <li><strong>Support Requests:</strong> Information you provide when contacting our support team.</li>
    </ul>

    <h2>2. How We Use Your Information</h2>
    <ul>
      <li>To deliver licenses, software updates, and customer support.</li>
      <li>To process payments and issue invoices.</li>
      <li>To improve our products and develop new features.</li>
      <li>To send important transactional and security notifications.</li>
    </ul>

    <h2>3. Data Storage & Security</h2>
    <p>
      We use 256-bit SSL encryption for all data transmissions. User data is stored on secure servers with
      restricted access, regular security audits, and industry-standard protection measures.
    </p>

    <h2>4. Data Sharing</h2>
    <p>
      We do <strong>not</strong> sell, rent, or trade your personal information. We may share data only with:
    </p>
    <ul>
      <li>Trusted payment processors (Stripe, PayPal) for transaction processing.</li>
      <li>Email delivery services for license keys and notifications.</li>
      <li>Legal authorities when required by law.</li>
    </ul>

    <h2>5. Your Rights</h2>
    <ul>
      <li>Access, correct, or delete your personal data at any time.</li>
      <li>Opt out of marketing communications.</li>
      <li>Request a copy of all data we hold about you.</li>
      <li>Withdraw consent for data processing.</li>
    </ul>

    <h2>6. Cookies</h2>
    <p>
      We use cookies to remember preferences and analyze site traffic. See our Cookie Preferences page to manage settings.
    </p>

    <h2>7. GDPR & CCPA Compliance</h2>
    <p>
      WindowsUtils complies with GDPR (EU) and CCPA (California) regulations. EU and California residents
      have additional rights regarding their personal data.
    </p>

    <h2>8. Contact</h2>
    <p>For privacy concerns, contact our Data Protection Officer at <strong>privacy@windowsutils.com</strong>.</p>
  </LegalPageLayout>
  </>
);

export default Privacy;
