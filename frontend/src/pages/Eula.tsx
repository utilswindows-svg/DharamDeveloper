import LegalPageLayout from "./legal/LegalPageLayout";

const Eula = () => (
  <LegalPageLayout
    title="End User License Agreement (EULA)"
    subtitle="Please read this agreement carefully before installing or using our software."
    lastUpdated="January 1, 2026"
  >
    <h2>1. Grant of License</h2>
    <p>
      WindowsUtils Pvt. Ltd. ("Licensor") grants you ("Licensee") a non-exclusive, non-transferable license
      to install and use the WindowsUtils software ("Software") on the number of machines specified by your
      purchased license tier (Personal, Business, Enterprise, or Technician).
    </p>

    <h2>2. Permitted Use</h2>
    <ul>
      <li>You may install the Software on the number of devices permitted by your license.</li>
      <li>You may create backups of the Software for archival purposes.</li>
      <li>You may use the Software for lawful business or personal data operations.</li>
    </ul>

    <h2>3. Restrictions</h2>
    <ul>
      <li>You may not reverse engineer, decompile, or disassemble the Software.</li>
      <li>You may not rent, lease, sublicense, or distribute the Software.</li>
      <li>You may not remove proprietary notices or labels from the Software.</li>
      <li>You may not use the Software for illegal data extraction or unauthorized access.</li>
    </ul>

    <h2>4. Intellectual Property</h2>
    <p>
      The Software is protected by copyright laws and international treaties. WindowsUtils® is a registered
      trademark of Windows Utils Pvt. Ltd. All rights, title, and interest in the Software remain with the Licensor.
    </p>

    <h2>5. Updates and Support</h2>
    <p>
      Your license includes free updates and technical support for one (1) year from the date of purchase.
      After that period, you may renew support and updates separately.
    </p>

    <h2>6. Termination</h2>
    <p>
      This license is effective until terminated. Your rights under this license will terminate automatically
      without notice if you fail to comply with any term hereof.
    </p>

    <h2>7. Limitation of Liability</h2>
    <p>
      In no event shall WindowsUtils Pvt. Ltd. be liable for any indirect, incidental, special, or consequential
      damages arising out of the use or inability to use the Software.
    </p>

    <h2>8. Governing Law</h2>
    <p>This Agreement shall be governed by and construed in accordance with the applicable laws.</p>

    <h2>9. Contact</h2>
    <p>For questions about this EULA, contact <strong>legal@windowsutils.com</strong>.</p>
  </LegalPageLayout>
);

export default Eula;
