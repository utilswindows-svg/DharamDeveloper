import LegalPageLayout from "./legal/LegalPageLayout";

const QualityPolicy = () => (
  <LegalPageLayout
    title="Quality Policy"
    subtitle="Our commitment to delivering reliable, secure, and high-performance software."
    lastUpdated="January 1, 2026"
  >
    <h2>Our Quality Commitment</h2>
    <p>
      At WindowsUtils Pvt. Ltd., quality is the cornerstone of every product we develop. We are committed
      to delivering software that exceeds customer expectations through rigorous engineering, testing, and
      continuous improvement.
    </p>

    <h2>1. Product Excellence</h2>
    <ul>
      <li>Every release passes through multi-stage QA testing on Windows 7, 8, 10, and 11.</li>
      <li>Automated and manual regression tests on every build.</li>
      <li>Performance benchmarking against industry standards.</li>
      <li>Compatibility verified across enterprise environments.</li>
    </ul>

    <h2>2. Security Standards</h2>
    <ul>
      <li>256-bit SSL encryption for all data transmissions.</li>
      <li>Code-signed installers from a trusted Certificate Authority.</li>
      <li>Regular third-party security audits.</li>
      <li>Compliance with ISO 27001 information security standards.</li>
    </ul>

    <h2>3. Customer Focus</h2>
    <ul>
      <li>24/7 technical support via email, chat, and phone.</li>
      <li>Average response time under 2 hours for premium customers.</li>
      <li>Continuous feedback collection and product roadmap transparency.</li>
      <li>Free upgrades and patches for one year from purchase.</li>
    </ul>

    <h2>4. Continuous Improvement</h2>
    <p>
      We follow Agile development methodology with sprint-based releases, ensuring rapid bug fixes and
      feature delivery. Customer feedback directly shapes our product roadmap.
    </p>

    <h2>5. Industry Certifications</h2>
    <ul>
      <li>Microsoft Certified Partner</li>
      <li>ISO 9001:2015 Quality Management System</li>
      <li>ISO 27001 Information Security Management</li>
      <li>GDPR Compliant</li>
    </ul>

    <h2>6. Trusted by 1M+ Users Globally</h2>
    <p>
      With over 1 million users across 180+ countries, WindowsUtils products serve individuals, SMBs,
      enterprises, government agencies, and Fortune 500 companies worldwide.
    </p>

    <h2>Quality Assurance Contact</h2>
    <p>For quality concerns, contact <strong>quality@windowsutils.com</strong>.</p>
  </LegalPageLayout>
);

export default QualityPolicy;
