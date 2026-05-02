import LegalPageLayout from "./legal/LegalPageLayout";

const RefundPolicy = () => (
  <LegalPageLayout
    title="Refund Policy"
    subtitle="30-day money-back guarantee on all our products. No questions asked."
    lastUpdated="January 1, 2026"
  >
    <h2>1. 30-Day Money-Back Guarantee</h2>
    <p>
      We offer a full <strong>30-day money-back guarantee</strong> on all WindowsUtils software purchases.
      If you're not satisfied for any reason, request a refund within 30 days of purchase.
    </p>

    <h2>2. Eligibility for Refund</h2>
    <p>You're eligible for a refund if:</p>
    <ul>
      <li>The software does not perform as advertised.</li>
      <li>You experience technical issues that our support team cannot resolve.</li>
      <li>You purchased the wrong product by mistake.</li>
      <li>The refund is requested within 30 days of original purchase.</li>
    </ul>

    <h2>3. Non-Refundable Cases</h2>
    <ul>
      <li>Refund requests made after 30 days from purchase.</li>
      <li>Customized or technician licenses with bulk pricing already redeemed.</li>
      <li>Cases of policy abuse or repeated refund requests.</li>
      <li>Refunds for renewals more than 7 days after the renewal date.</li>
    </ul>

    <h2>4. How to Request a Refund</h2>
    <p>To request a refund, please:</p>
    <ul>
      <li>Email <strong>refunds@windowsutils.com</strong> with your order ID.</li>
      <li>Include the reason for the refund request.</li>
      <li>Allow our team up to 48 hours to review your request.</li>
    </ul>

    <h2>5. Processing Time</h2>
    <p>
      Approved refunds are processed within <strong>5–7 business days</strong>. The amount will be credited
      back to your original payment method. Bank processing may take additional time.
    </p>

    <h2>6. License Deactivation</h2>
    <p>
      Upon refund approval, your license key will be deactivated. You must uninstall the software and remove
      all copies from your devices.
    </p>

    <h2>7. Free Trial</h2>
    <p>
      We strongly recommend trying our <strong>free trial</strong> before purchasing to ensure the software
      meets your requirements.
    </p>

    <h2>8. Contact</h2>
    <p>For refund-related queries: <strong>refunds@windowsutils.com</strong></p>
  </LegalPageLayout>
);

export default RefundPolicy;
