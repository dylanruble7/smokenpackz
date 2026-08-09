import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="smoke-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/" className="nav-link inline-flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>

        <h1 className="font-medieval text-4xl font-bold text-osrs-goldBright mb-2">Privacy Policy</h1>
        <p className="text-stoner-haze/40 text-sm mb-8">Last modified: August 2026</p>

        <div className="space-y-6 text-stoner-haze/70">
          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">1. Introduction</h2>
            <p>
              SmokenPackz ("we", "us", or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and disclose your information when you use our website at smokenpackz.com ("Site") and our services. By using the Site, you consent to the practices described in this Privacy Policy.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Contact Information:</strong> Email address, Discord username, and in-game RSN (RuneScape Name) provided during checkout.</li>
              <li><strong>Payment Information:</strong> Transaction details processed through NOWPayments (crypto), CashApp, or OSRS GP transactions. We do not store wallet private keys or full payment credentials.</li>
              <li><strong>Order Information:</strong> Order ID, items purchased, transaction amounts, and delivery status.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage data collected automatically.</li>
              <li><strong>Communications:</strong> Messages sent to us via Discord, email, or other channels.</li>
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">3. How We Use Your Information</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>To process and fulfill orders, including delivery of digital items</li>
              <li>To communicate with you about your orders and provide customer support</li>
              <li>To verify your identity and prevent fraud</li>
              <li>To improve our Site, services, and user experience</li>
              <li>To comply with legal obligations and enforce our Terms of Service</li>
              <li>To send promotional communications (you may opt out at any time)</li>
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">4. Sharing of Information</h2>
            <p className="mb-3">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Payment Processors:</strong> NOWPayments and other payment providers to process transactions</li>
              <li><strong>Sellers:</strong> Necessary order details to facilitate delivery</li>
              <li><strong>Legal Authorities:</strong> If required by law, court order, or government regulation</li>
              <li><strong>Service Providers:</strong> Third parties that help us operate the Site (hosting, analytics)</li>
            </ul>
            <p className="mt-3">
              We share only the minimum information necessary for these purposes.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">5. Data Security</h2>
            <p className="mb-3">
              We implement reasonable technical and organizational measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction. These measures include encryption, access controls, and secure server infrastructure.
            </p>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security, and you use the Site at your own risk.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. Transaction records may be retained for up to 7 years for legal and tax purposes.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">7. Your Rights</h2>
            <p className="mb-3">Depending on your jurisdiction, you may have the following rights:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from promotional communications</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us on Discord or via email.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">8. Cookies</h2>
            <p>
              The Site may use cookies and similar technologies to improve user experience, analyze traffic, and remember preferences. You can control cookies through your browser settings. Disabling cookies may affect some features of the Site.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">9. Third-Party Links</h2>
            <p>
              The Site may contain links to third-party websites (e.g., Discord, NOWPayments). We are not responsible for the privacy practices or content of these third-party sites. We encourage you to read their privacy policies.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">10. Children's Privacy</h2>
            <p>
              The Site is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time by posting the updated version on the Site. Your continued use of the Site after changes are posted constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="font-medieval text-xl text-osrs-goldBright mb-3">12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our Discord server or by email. We are committed to addressing your privacy concerns promptly.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
